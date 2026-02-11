import { baseUrl } from '@/base/core/networkStructure/baseUrl'
import { Client, type StompSubscription, type IFrame } from '@stomp/stompjs'
import { ref, type Ref } from 'vue'

export interface WebSocketConfig {
    brokerURL: string
    reconnectDelay: number
    heartbeatIncoming: number
    heartbeatOutgoing: number
    debug: boolean
    maxReconnectAttempts?: number
    connectionTimeout?: number
}

export interface Notification {
    id: string
    title: string
    isBroadcast?: boolean
    targetUserId?: string
    message?: string
    status?: "READ" | "PENDING"
    data?: { type: number, type_id: number }
    body?: string
    [key: string]: any
}
export interface EnrichedNotification extends Notification {
    type: NotificationType
    receivedAt: Date
}

export type NotificationType = 'broadcast' | 'direct' | 'pending'
type EventHandler = (data: any) => void

class WebSocketNotificationService {
    private client: Client | null
    public connected: Ref<boolean>
    public error: Ref<string | null>
    public notifications: Ref<EnrichedNotification[]>
    public acknowledgeCount: Ref<number>
    public logs: Ref<string[]>
    public unreadCount: Ref<number>

    private processedNotificationIds: Set<string>
    private subscriptions: Map<string, StompSubscription>
    private config: WebSocketConfig
    private eventHandlers: Map<string, EventHandler[]>
    private reconnectAttempts: number
    private connectionTimeout: NodeJS.Timeout | null
    private isManualDisconnect: boolean

    constructor() {
        this.client = null
        this.connected = ref(false)
        this.error = ref(null)
        this.notifications = ref([])
        this.logs = ref([])
        this.processedNotificationIds = new Set()
        this.subscriptions = new Map()
        this.config = {
            brokerURL: 'wss://socket.techlabeg.com/ws',
            reconnectDelay: 5000,
            heartbeatIncoming: 10000,
            heartbeatOutgoing: 10000,
            debug: true,
            maxReconnectAttempts: 10,
            connectionTimeout: 30000
        }
        this.eventHandlers = new Map()
        this.reconnectAttempts = 0
        this.connectionTimeout = null
        this.isManualDisconnect = false
        this.acknowledgeCount = ref(0)
        this.unreadCount = ref(0)
    }

    /**
     * Configure the service
     */
    configure(options: Partial<WebSocketConfig> = {}): this {
        this.config = { ...this.config, ...options }
        // Ensure WSS protocol for secure connections
        if (this.config.brokerURL.startsWith('ws://') &&
            !this.config.brokerURL.includes('localhost')) {
            this.config.brokerURL = this.config.brokerURL.replace('ws://', 'wss://')
            this.addLog('⚠ Switched to secure WebSocket (wss://)')
        }
        return this
    }

    /**
     * Add a log entry
     */
    addLog(message: string): void {
        const timestamp = new Date().toLocaleTimeString()
        this.logs.value.push(`[${timestamp}] ${message}`)
        if (this.config.debug) {
            console.log(message)
        }
    }

    /**
     * Register an event handler
     */
    on(event: string, handler: EventHandler): this {
        if (!this.eventHandlers.has(event)) {
            this.eventHandlers.set(event, [])
        }
        this.eventHandlers.get(event)?.push(handler)
        return this
    }

    /**
     * Remove an event handler
     */
    off(event: string, handler?: EventHandler): this {
        if (!handler) {
            this.eventHandlers.delete(event)
        } else {
            const handlers = this.eventHandlers.get(event)
            if (handlers) {
                const index = handlers.indexOf(handler)
                if (index > -1) {
                    handlers.splice(index, 1)
                }
            }
        }
        return this
    }

    /**
     * Emit an event
     */
    emit(event: string, data?: any): void {
        const handlers = this.eventHandlers.get(event) || []
        handlers.forEach(handler => {
            try {
                handler(data)
            } catch (error: any) {
                this.addLog(`❌ Error in event handler for ${event}: ${error.message}`)
            }
        })
    }

    /**
     * Handle incoming notifications
     */
    handleNotification(notification: Notification, type: NotificationType): void {
        // Prevent duplicates
        if (this.processedNotificationIds.has(notification.id)) {
            this.addLog(`⚠ Duplicate ${type} notification ignored: ${notification.id}`)
            return
        }

        const typeIcon: Record<NotificationType, string> = {
            broadcast: '📢',
            direct: '📩',
            pending: '⏳'
        }

        this.addLog(`${typeIcon[type] || '📬'} ${type}: ${notification.title} (ID: ${notification.id})`)

        const enrichedNotification: EnrichedNotification = {
            ...notification,
            type,
            receivedAt: new Date()
        }
        this.notifications.value.unshift(enrichedNotification)
        this.processedNotificationIds.add(notification.id)

        // Emit event for external handlers
        this.emit('notification', enrichedNotification)
        this.emit(`notification:${type}`, enrichedNotification)

        // Send acknowledgment
        this.acknowledgeNotification(notification.id)
    }

    /**
     * Send acknowledgment for a notification
     */
    acknowledgeNotification(notificationId: string): void {
        if (this.client && this.client.connected) {
            try {
                this.client.publish({
                    destination: '/app/acknowledge',
                    body: JSON.stringify({ notificationId })
                })

                this.addLog(`✓ ACK sent for notification ${notificationId}`)
                this.emit('acknowledged', notificationId)
                // this.notifications.value = this.notifications.value.filter(notification => notification.id !== notificationId)
            } catch (error: any) {
                this.addLog(`❌ Failed to send ACK: ${error.message}`)
            }
        }
    }

    /**
     * Subscribe to a channel
     */
    subscribe(
        destination: string,
        handler: (data: any, channelType?: string) => void,
        channelType: string = 'custom'
    ): StompSubscription | null {
        if (!this.client || !this.client.connected) {
            this.addLog('⚠ Cannot subscribe: Not connected')
            return null
        }

        try {
            const subscription = this.client.subscribe(destination, (message) => {
                try {
                    const data = JSON.parse(message.body)
                    handler(data, channelType)
                } catch (error: any) {
                    this.addLog(`❌ Error parsing message from ${destination}: ${error.message}`)
                }
            })

            this.subscriptions.set(destination, subscription)
            this.addLog(`✓ Subscribed to ${destination}`)
            return subscription
        } catch (error: any) {
            this.addLog(`❌ Failed to subscribe to ${destination}: ${error.message}`)
            return null
        }
    }

    /**
     * Unsubscribe from a channel
     */
    unsubscribe(destination: string): void {
        const subscription = this.subscriptions.get(destination)
        if (subscription) {
            try {
                subscription.unsubscribe()
                this.subscriptions.delete(destination)
                this.addLog(`✓ Unsubscribed from ${destination}`)
            } catch (error: any) {
                this.addLog(`❌ Error unsubscribing from ${destination}: ${error.message}`)
            }
        }
    }

    /**
     * Setup default notification channels
     */
    setupDefaultChannels(): void {
        // Broadcast notifications
        this.subscribe('/topic/notifications', (notification) => {
            this.handleNotification(notification, 'broadcast')
        }, 'broadcast')

        // Direct notifications
        this.subscribe('/user/queue/notifications', (notification) => {
            this.handleNotification(notification, 'direct')
        }, 'direct')

        // Pending/unacknowledged notifications
        this.subscribe('/user/queue/pending', (data) => {

            console.log('data', data)
            this.addLog(`📦 Received ${data.length ?? 0} pending/unacknowledged notifications`)

            if (Array.isArray(data)) {
                this.addLog(`📦 Received ${data.length ?? 0} pending/unacknowledged notifications`)
                this.addLog(`data ${data}`)
                data.forEach(notification => {
                    const type: NotificationType = notification.isBroadcast ? 'broadcast' :
                        notification.targetUserId ? 'direct' : 'pending'
                    this.handleNotification(notification, type)
                })
            }
        }, 'pending')

        // Acknowledgments
        this.subscribe('/user/queue/ack', (ack) => {

            this.addLog(`ACK received for: ${ack}`)

            this.addLog(`✓ Server confirmed ACK for: ${ack}`)
            this.emit('ack:confirmed', ack)
        }, 'ack')
    }

    /**
     * Clear connection timeout
     */
    private clearConnectionTimeout(): void {
        if (this.connectionTimeout) {
            clearTimeout(this.connectionTimeout)
            this.connectionTimeout = null
        }
    }

    /**
     * Connect to WebSocket server
     */
    connect(token: string): Promise<IFrame | void> {
        if (this.client && this.client.connected) {
            this.addLog('⚠ Already connected')
            return Promise.resolve()
        }

        this.isManualDisconnect = false

        return new Promise((resolve, reject) => {
            this.addLog(`🔌 Connecting to WebSocket... (Attempt ${this.reconnectAttempts + 1})`)

            // Set connection timeout
            this.connectionTimeout = setTimeout(() => {
                this.addLog('❌ Connection timeout')
                this.error.value = 'Connection timeout'
                if (this.client) {
                    this.client.deactivate()
                }
                reject(new Error('Connection timeout'))
            }, this.config.connectionTimeout || 30000)

            this.client = new Client({
                brokerURL: this.config.brokerURL,
                connectHeaders: {
                    Authorization: `Bearer ${token}`,
                    'Accept-Version': '1.2',
                    'heart-beat': `${this.config.heartbeatOutgoing},${this.config.heartbeatIncoming}`
                },
                debug: (str) => {
                    if (this.config.debug && str.length < 200) {
                        this.addLog(`STOMP: ${str}`)
                    }
                },
                reconnectDelay: this.config.reconnectDelay,
                heartbeatIncoming: this.config.heartbeatIncoming,
                heartbeatOutgoing: this.config.heartbeatOutgoing,

                // Important: Configure WebSocket options
                webSocketFactory: () => {
                    const ws = new WebSocket(this.config.brokerURL)

                    ws.onerror = (event) => {
                        this.addLog('❌ WebSocket error occurred')
                    }

                    return ws
                },

                onConnect: (frame) => {
                    this.clearConnectionTimeout()
                    this.addLog('✅ CONNECTED!')
                    this.connected.value = true
                    this.error.value = null
                    this.reconnectAttempts = 0

                    // Setup default channels
                    this.setupDefaultChannels()

                    // Request pending notifications
                    this.requestPendingNotifications()

                    this.emit('connected', frame)
                    resolve(frame)
                },

                onStompError: (frame) => {
                    this.clearConnectionTimeout()
                    const errorMsg = frame.headers['message'] || 'STOMP protocol error'
                    this.addLog(`❌ STOMP Error: ${errorMsg}`)
                    this.error.value = errorMsg
                    this.connected.value = false
                    this.emit('error', errorMsg)

                    // Don't reject on STOMP errors if reconnecting
                    if (this.reconnectAttempts === 0) {
                        reject(new Error(errorMsg))
                    }
                },

                onWebSocketError: (event) => {
                    this.addLog('❌ WebSocket Error')
                    this.error.value = 'WebSocket error'
                    this.connected.value = false
                    this.emit('error', 'WebSocket error')
                },

                onWebSocketClose: (event) => {
                    this.clearConnectionTimeout()

                    // Error code 1006 means abnormal closure
                    if (event.code === 1006) {
                        this.addLog('🔌 Abnormal closure (1006) - Connection lost unexpectedly')
                        this.error.value = 'Connection lost'
                    } else {
                        this.addLog(`🔌 Closed: ${event.code} - ${event.reason || 'No reason provided'}`)
                    }

                    this.connected.value = false
                    this.emit('disconnected', event)

                    // Handle reconnection
                    if (!this.isManualDisconnect &&
                        this.reconnectAttempts < (this.config.maxReconnectAttempts || 10)) {
                        this.reconnectAttempts++
                        this.addLog(`🔄 Will attempt reconnection in ${this.config.reconnectDelay}ms...`)
                    } else if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 10)) {
                        this.addLog('❌ Max reconnection attempts reached')
                        this.error.value = 'Max reconnection attempts reached'
                    }
                },

                onDisconnect: () => {
                    this.clearConnectionTimeout()
                    this.addLog('🔌 Disconnected')
                    this.connected.value = false
                    this.emit('disconnected')
                }
            })

            try {
                this.client.activate()
            } catch (error: any) {
                this.clearConnectionTimeout()
                this.addLog(`❌ Failed to activate client: ${error.message}`)
                this.error.value = error.message
                reject(error)
            }
        })
    }

    /**
     * Request pending notifications
     */
    requestPendingNotifications(): void {
        if (this.client && this.client.connected) {
            try {
                this.addLog('📨 Requesting pending/unacknowledged notifications...')
                this.client.publish({
                    destination: '/app/connect',
                    body: '{}'
                })
            } catch (error: any) {
                this.addLog(`❌ Failed to request pending notifications: ${error.message}`)
            }
        }
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        this.isManualDisconnect = true
        this.clearConnectionTimeout()

        if (this.client) {
            try {
                // Unsubscribe from all channels
                this.subscriptions.forEach((_, destination) => {
                    this.unsubscribe(destination)
                })

                this.client.deactivate()
                this.addLog('🔌 Disconnecting...')
            } catch (error: any) {
                this.addLog(`❌ Error during disconnect: ${error.message}`)
            }
        }
    }

    /**
     * Send a message to a destination
     */
    publish(destination: string, body: any): boolean {
        if (this.client && this.client.connected) {
            try {
                this.client.publish({
                    destination,
                    body: typeof body === 'string' ? body : JSON.stringify(body)
                })
                this.addLog(`📤 Published to ${destination}`)
                return true
            } catch (error: any) {
                this.addLog(`❌ Failed to publish: ${error.message}`)
                return false
            }
        }
        this.addLog('⚠ Cannot publish: Not connected')
        return false
    }

    /**
     * Clear all notifications
     */
    clearNotifications(): void {
        this.notifications.value = []
        this.processedNotificationIds.clear()
        this.addLog('🗑 Notifications cleared')
        this.emit('notifications:cleared')
    }

    /**
     * Clear logs
     */
    clearLogs(): void {
        this.logs.value = []
    }

    /**
     * Get notification by ID
     */
    getNotificationById(id: string): EnrichedNotification | undefined {
        return this.notifications.value.find(n => n.id === id)
    }

    /**
     * Get notifications by type
     */
    getNotificationsByType(type: NotificationType): EnrichedNotification[] {
        return this.notifications.value.filter(n => n.type === type)
    }



    /**
     * Remove notification by ID
     */
    removeNotification(id: string): void {
        const index = this.notifications.value.findIndex(n => n.id === id)
        if (index !== -1) {
            this.notifications.value.splice(index, 1)
            this.processedNotificationIds.delete(id)
            this.emit('notification:removed', id)
        }
    }


    /**
     * Reset reconnection attempts
     */
    resetReconnectionAttempts(): void {
        this.reconnectAttempts = 0
    }

    /**
     * Get connection status
     */
    getStatus(): {
        connected: boolean
        error: string | null
        reconnectAttempts: number
    } {
        return {
            connected: this.connected.value,
            error: this.error.value,
            reconnectAttempts: this.reconnectAttempts
        }
    }


    /**
     fetch notifications
     */
    async fetchNotifications(token: string): Promise<void> {
        const res = await fetch(baseUrl + 'organization/' + 'fetch_notifications', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })

        if (!res.ok) {
            throw new Error('Failed to fetch notifications')
        }
        const data = await res.json()
        // console.log(data)
        this.notifications.value = data.data
        this.unreadCount.value = data.data.filter((notification: any) => notification.status === 'PENDING').length
        this.emit('notifications:updated', data.data)
    }
}

// Export singleton instance
export const notificationService = new WebSocketNotificationService()

// Export class for creating multiple instances if needed
export default WebSocketNotificationService