<script setup lang="ts">
import { ref, watch } from 'vue'
// import Notification from '../../icons/Notification.vue'
import { useIntegratedNotifications } from '@/composables/useIntegratedNotifications'
import { useToast } from 'primevue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import Popover from 'primevue/popover'
import wordSlice from '@/base/Presentation/utils/word_slice'
import Notification from '../icons/Notification.vue'
import { NotificationEnum } from './Enums/NotificationEnum'
import Ring from '@/assets/Ring/Ring.txt'
import type { EnrichedNotification } from '@/services/WebSocketNotificationService'
import RefreshNotificationTokenController from '@/features/notification/Presentation/controllers/RefreshNotificationTokenController.ts'
import RefreshNotificationParams from '@/features/notification/Core/params/RefreshNotificationParams.ts'
// import { NOTIFICATION_SOUND_BASE64 } from '@/base/Presentation/utils/notification_ring.ts'

const op = ref()
const toggle = (event: Event) => {
  op.value.toggle(event)
}
const toast = useToast()
const userStore = useUserStore() // Already defined above
const router = useRouter()
// Notification sound

const getNotificationPayload = (notification: EnrichedNotification) => {
  const body = notification.body
  const bodyItem = Array.isArray(body) ? body[0] : undefined
  const parsedBodyItem = Array.isArray(notification.parsedBody)
    ? notification.parsedBody[0]
    : undefined
  const parsedData = !Array.isArray(notification.parsedBody)
    ? notification.parsedBody?.data
    : undefined

  return {
    type: Number(
      notification.routeType ??
        notification.data?.type ??
        bodyItem?.type ??
        parsedBodyItem?.type ??
        parsedData?.type,
    ),
    typeId: Number(
      notification.routeTypeId ??
        notification.data?.type_id ??
        bodyItem?.type_id ??
        parsedBodyItem?.type_id ??
        parsedData?.type_id,
    ),
    title:
      notification.title ||
      bodyItem?.title ||
      parsedBodyItem?.title ||
      notification.parsedBody?.title ||
      'New Notification',
    message:
      notification.displayMessage ||
      bodyItem?.message ||
      parsedBodyItem?.message ||
      notification.parsedBody?.message ||
      notification.message ||
      '',
  }
}
const NOTIFICATION_SOUND_BASE64 =
  'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIF2W56+mmUBELTKXh8bllHAU2jdXvyn0tBSh+zPLaizsKGGS46Om1XBoFM4nU8c1+LgYngM3y3I4+ChlluOvpplARC0ul4fG5ZRwFNo3V78p9LQUofszy2os7ChhluevrpVERC0yn4fG3ZBwFOI7U8ct+LQUoftDy24k7ChZluujoplARDEul4e+3ZRwGOY/V8Mp/LgYpf9Dy3Ik7CxZluejpplARDEym4fG3ZBwFOI/V8cp+LQYoftDy24o7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuujqplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/LgYof9Dy3Io7ChZmuejpplARDEym4fG3YxwFOI/V8Ml/'
const refreshNotificationTokenController = RefreshNotificationTokenController.getInstance()
const refreshInProgress = ref(false)
let recoveryAttempted = false

// Integrate new notification system
const {
  notifications,
  unreadCount,
  acknowledgeNotification,
  wsConnected,
  wsError,
  reconnectWebSocket,
} = useIntegratedNotifications({
  autoConnect: true,
  token: userStore.user?.WebSocketToken,
  userId: userStore.user?.id,
  fetchNotifications: true,
  userToken: userStore.user?.apiToken,
  onNotification: (notification) => {
    const payload = getNotificationPayload(notification)
    const audio = new Audio(NOTIFICATION_SOUND_BASE64)
    audio.play()

    toast.add({
      severity: 'info',
      summary: payload.title,
      detail: payload.message,
      life: 5000,
    })
  },
})

const handleNotificationClick = (notification: EnrichedNotification) => {
  const payload = getNotificationPayload(notification)
  navigateToNotification(payload.type, payload.typeId)
  op.value?.hide?.()
}

const formatNotificationTime = (value?: Date | string | number) => {
  if (!value) return ''

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const navigateToNotification = (notificationType: number, typeId?: number) => {
  switch (notificationType) {
    case NotificationEnum.OBSERVATION: // PDSP
      router.push(
        typeId
          ? `/organization/equipment-mangement/observation/show/${typeId}?type=2`
          : '/organization/equipment-mangement/observation?isAll=1&type=2',
      )
      break
    case NotificationEnum.INCIDENT: // PDSP
      router.push(
        typeId
          ? `/organization/equipment-mangement/incedant/show/${typeId}`
          : '/organization/equipment-mangement/incedant?isAll=1',
      )
      break
    case NotificationEnum.TASK: // PDSP
      router.push(
        typeId
          ? `/organization/equipment-mangement/inspection?inspectionType=2&typeId=${typeId}`
          : '/organization/equipment-mangement/inspection?inspectionType=2',
      )

      break

    case NotificationEnum.PROJECT: // PDSP
      router.push(
        typeId
          ? { name: 'Project Details', params: { id: typeId }, query: { type: '1' } }
          : '/organization/projects',
      )

      break
      // case NotificationEnum.INVESTEGATION: // PDSP
      // router.push(
      //   typeId
      //     ? `/organization/Investigating-result/207?investigating_id=${typeId}`
      //     : '/organization/Investigating',
      // )

      break

    default:
      console.warn('Unknown notification type:', notificationType)
  }
}

const recoverWebSocketConnection = async () => {
  if (wsConnected.value || refreshInProgress.value || recoveryAttempted) return

  recoveryAttempted = true
  refreshInProgress.value = true

  try {
    const result = await refreshNotificationTokenController.RefreshToken(
      new RefreshNotificationParams(),
    )
    const refreshedToken = result.value.data?.notificationSocketToken

    // The original connection may have recovered while the refresh request was running.
    if (!refreshedToken || wsConnected.value) return

    await reconnectWebSocket(refreshedToken)
  } catch (error) {
    console.error('Unable to recover the notification connection:', error)
  } finally {
    refreshInProgress.value = false
  }
}

watch(
  [wsConnected, wsError],
  ([connected, error], [wasConnected]) => {
    if (connected) {
      recoveryAttempted = false
      return
    }

    // Do not refresh on the composable's initial disconnected state. Recover only
    // after a real disconnect or after the first connection reports an error.
    if (wasConnected || error) {
      void recoverWebSocketConnection()
    }
  },
  { immediate: true },
)
</script>
<template>
  <div class="notification-center">
    <button
      class="notification"
      type="button"
      :aria-label="$t('notifications')"
      :title="$t('notifications')"
      @click="toggle"
    >
      <span class="notification-glow" aria-hidden="true"></span>
      <span class="circle-icon" aria-hidden="true"><Notification /></span>
      <span :class="['status-dot', wsConnected ? 'connected' : 'disconnected']"></span>
      <span v-if="unreadCount > 0" class="notification-count">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <Popover ref="op" class="notification-popover">
      <section class="notification-panel" :aria-label="$t('notifications')">
        <header class="notification-panel-header">
          <div class="panel-heading">
            <span class="panel-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
              </svg>
            </span>
            <span>
              <small>{{ $t('Notification center') }}</small>
              <strong>{{ $t('notifications') }}</strong>
            </span>
          </div>
          <span class="unread-summary" :class="{ 'has-unread': unreadCount > 0 }">
            <i aria-hidden="true"></i>
            {{ unreadCount }} {{ $t('unread') }}
          </span>
        </header>

        <div class="notification-panel-context">
          <span>{{ $t('Latest updates') }}</span>
          <span :class="['connection-state', wsConnected ? 'is-live' : 'is-offline']">
            <i aria-hidden="true"></i>
            {{ wsConnected ? $t('Live') : $t('Offline') }}
          </span>
        </div>

        <ul v-if="notifications.length > 0" class="notification-list">
          <li
            v-for="notification in notifications"
            :key="notification.id"
            class="notification-item"
            :class="{ 'is-unread': notification.status === 'PENDING' }"
          >
            <button
              class="notification-card"
              type="button"
              @click="handleNotificationClick(notification)"
            >
              <span class="notification-type-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M18 12h3M7 17h10M9 21h6" />
                  <path d="M8 13a4 4 0 1 1 8 0v4H8z" />
                </svg>
              </span>
              <span class="notification-copy">
                <span class="notification-title-row">
                  <strong>{{ wordSlice(getNotificationPayload(notification).title, 38) }}</strong>
                  <i v-if="notification.status === 'PENDING'" aria-label="Unread"></i>
                </span>
                <p>{{ wordSlice(getNotificationPayload(notification).message, 100) }}</p>
                <small v-if="formatNotificationTime(notification.receivedAt)">
                  <svg viewBox="0 0 20 20" aria-hidden="true">
                    <circle cx="10" cy="10" r="7" />
                    <path d="M10 6v4l3 2" />
                  </svg>
                  {{ formatNotificationTime(notification.receivedAt) }}
                </small>
              </span>
              <span class="notification-arrow" aria-hidden="true">
                <svg viewBox="0 0 20 20"><path d="m7 4 6 6-6 6" /></svg>
              </span>
            </button>
          </li>
        </ul>

        <div v-else class="notification-empty">
          <span class="empty-orbit" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
              <path d="m8.5 11 2.2 2.2 4.8-4.8" />
            </svg>
          </span>
          <strong>{{ $t('You are all caught up') }}</strong>
          <p>{{ $t('New activity and important updates will appear here.') }}</p>
        </div>

        <footer class="notification-panel-footer">
          <span><i aria-hidden="true"></i>{{ $t('Real-time notifications') }}</span>
          <small>{{ notifications.length }} {{ $t('updates') }}</small>
        </footer>
      </section>
    </Popover>
  </div>
</template>
<style lang="scss" scoped>
.p-popover {
  border-radius: 16px !important;
}

.p-dialog-content {
  padding: 0;
}

.decoration-button {
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 0 5px 5px color-mix(in srgb, var(--text-strong) 10%, transparent);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  border: none;
  cursor: pointer;

  svg {
    animation: rotate 2s linear infinite;
    width: 25px;
    height: 25px;
    fill: var(--primary-color) !important;

    path {
      fill: var(--primary-color) !important;
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

/* Notification Button */
.notification {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid color-mix(in srgb, var(--surface-1) 10%, transparent);
}

.notification:hover {
  background: color-mix(in srgb, var(--surface-1) 10%, transparent);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px color-mix(in srgb, var(--text-strong) 10%, transparent);
}

.notification:active {
  transform: translateY(0);
}

/* Status Dot */
.status-dot {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: 2px solid var(--surface-1);
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.status-dot.connected {
  background: var(--status-success);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-success) 70%, transparent);
}

.status-dot.disconnected {
  background: var(--status-danger);
  box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-danger) 70%, transparent);
  animation: none;
}

@keyframes pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-success) 70%, transparent);
  }

  50% {
    box-shadow: 0 0 0 6px transparent;
  }
}

/* Notification Count Badge */
.notification-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--danger-color) 0%, var(--danger-color) 100%);
  color: var(--text-on-brand);
  font-size: 11px;
  font-weight: 600;
  border-radius: 10px;
  border: 2px solid var(--surface-1);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--brand-primary-400) 40%, transparent);
  animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes bounceIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }

  50% {
    transform: scale(1.1);
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Popover Container */
.list-notifaction-body {
  width: 380px;
  max-height: 500px;
  background: var(--surface-1);
  border-radius: 16px;
  box-shadow:
    0 20px 60px color-mix(in srgb, var(--shadow-color) 15%, transparent),
    0 0 0 1px color-mix(in srgb, var(--shadow-color) 5%, transparent);
  overflow: hidden;
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* List */
.list-notifaction {
  list-style: none;
  margin: 0;
  padding: 8px;
  max-height: 500px;
  overflow-y: auto;
}

.list-notifaction::-webkit-scrollbar {
  width: 6px;
}

.list-notifaction::-webkit-scrollbar-track {
  background: transparent;
}

.list-notifaction::-webkit-scrollbar-thumb {
  background: var(--main-border);
  border-radius: 3px;
}

.list-notifaction::-webkit-scrollbar-thumb:hover {
  background: var(--brand-secondary-700);
}

/* List Items */
.list-notifaction-item {
  margin-bottom: 4px;
  border-radius: 12px;
  padding: 12px;
  transition: all 0.2s ease;
}

.list-notifaction-item:last-child {
  margin-bottom: 0;
}

/* Empty Message */
.empty-msg {
  padding: 48px 24px;
  text-align: center;
  color: var(--text-soft);
  font-size: 14px;
}

/* Notification Item */
.list-notifaction-item.new-item {
  position: relative;
  padding: 12px;
  background: var(--brand-primary-50);
  cursor: pointer;
}

.list-notifaction-item.new-item:hover {
  background: var(--brand-primary-50);
  transform: translateX(4px);
}

.list-notifaction-item.new-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 60%;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-color) 100%);
  border-radius: 0 3px 3px 0;
}

/* Notification Content */
.notification-content-wrapper {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.notification-text {
  flex: 1;
  width: 100%;
  // min-width: 0;
}

.notification-text strong {
  display: block;
  color: var(--brand-primary-900);
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
  line-height: 1.4;
}

.notification-text p {
  color: var(--text-soft);
  font-size: 13px;
  line-height: 1.5;
  margin: 0 0 6px 0;
  word-wrap: break-word;
}

.notification-text small {
  color: var(--text-soft);
  font-size: 11px;
  font-weight: 500;
}

/* Remove Button */
.remove-btn {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 6px;
  background: transparent;
  color: var(--text-soft);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.6;
}

.remove-btn:hover {
  background: var(--status-danger);
  color: var(--text-on-brand);
  opacity: 1;
  transform: rotate(90deg);
}

.remove-btn:active {
  transform: rotate(90deg) scale(0.9);
}

/* Link Item (commented out in your code) */
.align-center {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  color: var(--brand-primary-400);
  font-weight: 600;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.align-center:hover {
  background: var(--brand-primary-50);
  color: var(--brand-accent-500);
}

/* Responsive */
@media (max-width: 480px) {
  .list-notifaction-body {
    width: calc(100vw - 32px);
    max-width: 380px;
  }
}

.clicked {
  background-color: var(--primary-color-opacity-1);
  color: var(--primary-color);
}

.year-selector-btn {
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 0 5px 5px color-mix(in srgb, var(--text-strong) 10%, transparent);
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;

  svg {
    width: 20px;
    height: 20px;
    stroke: var(--primary-color);
  }

  .year-text {
    font-weight: 600;
    color: var(--primary-color);
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 10px color-mix(in srgb, var(--text-strong) 15%, transparent);

    .year-text {
      color: var(--text-on-brand);
    }

    svg {
      stroke: var(--text-on-brand);

      path {
        fill: var(--text-on-brand);
      }
    }
  }
}

.year-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1rem 0;
}

.year-option {
  padding: 1rem;
  border: 2px solid var(--surface-2);
  border-radius: 8px;
  background-color: var(--text-on-brand);
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--primary-color);
    background-color: var(--primary-color-opacity-1);
    transform: translateX(5px);
  }

  &.year-option-active {
    border-color: var(--primary-color);
    background-color: var(--primary-color);
    color: var(--text-on-brand);

    &:hover {
      background-color: var(--primary-color);
      transform: translateX(0);
    }
  }
}

.text-header {
  h1 {
    font-family: 'header-text', sans-serif;
    text-transform: lowercase;
    font-size: 2rem;
    text-align: center;
    display: -webkit-flex;
    display: flex;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
    margin: 0;
    // min-height: calc(100vh - 16px);
    // background: var(--surface-1);
    position: relative;
    // background: var(--brand-secondary-900);
    // color: var(--text-strong);
    animation: movement 1s ease-in-out infinite alternate;

    @keyframes movement {
      0% {
        transform: translateY(0);
      }

      50% {
        transform: translateY(-5px);
      }

      100% {
        transform: translateY(0px);
      }
    }
  }

  h1:before {
    content: attr(data-text);
    position: absolute;
    background: linear-gradient(
      var(--brand-primary-700),
      var(--text-strong),
      var(--brand-primary-400),
      var(--brand-primary-700),
      var(--brand-primary-500),
      var(--brand-accent-500)
    );
    -webkit-background-clip: text;
    color: transparent;
    background-size: 100% 90%;
    line-height: 0.9;
    clip-path: ellipse(120px 120px at -2.54% -9.25%);
    animation: swing 5s infinite;
    animation-direction: alternate;
  }

  @keyframes swing {
    0% {
      -webkit-clip-path: ellipse(120px 120px at -2.54% -9.25%);
      clip-path: ellipse(120px 120px at -2.54% -9.25%);
    }

    50% {
      -webkit-clip-path: ellipse(120px 120px at 49.66% 64.36%);
      clip-path: ellipse(120px 120px at 49.66% 64.36%);
    }

    100% {
      -webkit-clip-path: ellipse(120px 120px at 102.62% -1.61%);
      clip-path: ellipse(120px 120px at 102.62% -1.61%);
    }
  }
}
</style>

<style scoped lang="scss">
.notification-center {
  position: relative;
  display: inline-flex;
}

.notification {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: visible;
  width: 46px;
  height: 46px;
  padding: 0;
  border: 1px solid color-mix(in srgb, var(--surface-1) 22%, transparent);
  border-radius: 15px;
  color: var(--text-on-brand);
  background: color-mix(in srgb, var(--surface-1) 13%, transparent);
  box-shadow: inset 0 1px 0 color-mix(in srgb, var(--surface-1) 17%, transparent);
  backdrop-filter: blur(12px);
  cursor: pointer;
  isolation: isolate;
  transition:
    transform 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.notification:hover {
  transform: translateY(-2px) rotate(-2deg);
  border-color: color-mix(in srgb, var(--surface-1) 38%, transparent);
  background: color-mix(in srgb, var(--surface-1) 22%, transparent);
  box-shadow:
    0 10px 22px color-mix(in srgb, var(--brand-primary-900) 18%, transparent),
    inset 0 1px 0 color-mix(in srgb, var(--surface-1) 24%, transparent);
}

.notification:active {
  transform: translateY(0) scale(0.96);
}

.notification:focus-visible {
  outline: 2px solid var(--text-on-brand);
  outline-offset: 3px;
}

.notification-glow {
  position: absolute;
  inset: 7px;
  z-index: -1;
  border-radius: 11px;
  background: color-mix(in srgb, var(--brand-primary-200) 28%, transparent);
  filter: blur(8px);
  opacity: 0;
  transition: opacity 0.2s ease;
}

.notification:hover .notification-glow {
  opacity: 1;
}

.circle-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.circle-icon :deep(svg) {
  width: 23px;
  height: 23px;
}

.circle-icon :deep(path) {
  stroke: currentColor !important;
}

.status-dot {
  position: absolute;
  right: 7px;
  bottom: 7px;
  width: 8px;
  height: 8px;
  border: 2px solid var(--brand-primary-600);
  border-radius: 50%;
}

.status-dot.connected {
  background: var(--status-success);
  animation: notification-pulse 2.2s ease-out infinite;
}

.status-dot.disconnected {
  background: var(--status-danger);
}

@keyframes notification-pulse {
  0%,
  100% {
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--status-success) 45%, transparent);
  }
  50% {
    box-shadow: 0 0 0 5px transparent;
  }
}

.notification-count {
  position: absolute;
  top: -7px;
  inset-inline-end: -7px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border: 2px solid var(--brand-primary-600);
  border-radius: 999px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--status-danger), var(--brand-accent-500));
  box-shadow: 0 5px 12px color-mix(in srgb, var(--status-danger) 35%, transparent);
  font-size: 10px;
  font-weight: 900;
  line-height: 1;
  animation: notification-badge-in 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes notification-badge-in {
  from {
    opacity: 0;
    transform: scale(0.45) rotate(-16deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}

:global(.notification-popover.p-popover) {
  overflow: hidden;
  margin-top: 10px;
  border: 1px solid color-mix(in srgb, var(--PrimaryColor) 12%, var(--main-border)) !important;
  border-radius: 21px !important;
  background: var(--surface-1) !important;
  box-shadow: 0 28px 70px color-mix(in srgb, var(--brand-primary-900) 22%, transparent) !important;
}

:global(.notification-popover .p-popover-content) {
  padding: 0 !important;
}

:global(.notification-popover::before),
:global(.notification-popover::after) {
  display: none !important;
}

.notification-panel {
  position: relative;
  overflow: hidden;
  width: min(410px, calc(100vw - 24px));
  background:
    radial-gradient(
      circle at 100% 0,
      color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
      transparent 30%
    ),
    var(--surface-1);
}

.notification-panel-header {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  padding: 17px 18px 14px;
  border-bottom: 1px solid var(--main-border);
}

.notification-panel-header::before {
  position: absolute;
  inset-inline: 18px;
  top: 0;
  height: 3px;
  border-radius: 0 0 999px 999px;
  background: linear-gradient(90deg, var(--PrimaryColor), var(--brand-secondary-500), transparent);
  content: '';
}

.panel-heading {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 10px;
}

.panel-heading > span:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.panel-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border-radius: 13px;
  color: var(--text-on-brand);
  background: linear-gradient(135deg, var(--PrimaryColor), var(--brand-secondary-500));
  box-shadow: 0 8px 18px color-mix(in srgb, var(--PrimaryColor) 22%, transparent);
}

.panel-mark svg {
  width: 21px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.7;
}

.panel-heading small {
  color: var(--PrimaryColor);
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.panel-heading strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.96rem;
  line-height: 1.3;
}

.unread-summary,
.connection-state {
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 6px;
  border-radius: 999px;
  font-size: 0.58rem;
  font-weight: 800;
}

.unread-summary {
  padding: 6px 9px;
  color: var(--text-soft);
  background: var(--surface-2);
}

.unread-summary i,
.connection-state i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
}

.unread-summary.has-unread {
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 8%, transparent);
}

.notification-panel-context {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 18px;
  color: var(--text-soft);
  background: color-mix(in srgb, var(--surface-2) 62%, transparent);
  font-size: 0.59rem;
  font-weight: 800;
}

.connection-state.is-live {
  color: var(--status-success);
}

.connection-state.is-offline {
  color: var(--status-danger);
}

.notification-list {
  max-height: 390px;
  overflow-y: auto;
  margin: 0;
  padding: 9px;
  list-style: none;
  scrollbar-color: color-mix(in srgb, var(--PrimaryColor) 22%, transparent) transparent;
  scrollbar-width: thin;
}

.notification-item + .notification-item {
  margin-top: 6px;
}

.notification-card {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
  padding: 12px;
  border: 1px solid transparent;
  border-radius: 14px;
  color: inherit;
  background: transparent;
  text-align: start;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease,
    box-shadow 0.18s ease;
}

.notification-card:hover {
  transform: translateX(2px);
  border-color: color-mix(in srgb, var(--PrimaryColor) 14%, var(--main-border));
  background: color-mix(in srgb, var(--PrimaryColor) 4%, var(--surface-1));
  box-shadow: 0 8px 20px color-mix(in srgb, var(--brand-primary-900) 7%, transparent);
}

.notification-item.is-unread .notification-card {
  border-color: color-mix(in srgb, var(--PrimaryColor) 13%, var(--main-border));
  background:
    linear-gradient(
      105deg,
      color-mix(in srgb, var(--PrimaryColor) 8%, transparent),
      transparent 48%
    ),
    var(--surface-1);
}

.notification-item.is-unread .notification-card::before {
  position: absolute;
  inset-block: 11px;
  inset-inline-start: 0;
  width: 3px;
  border-radius: 0 999px 999px 0;
  background: linear-gradient(180deg, var(--PrimaryColor), var(--brand-secondary-500));
  content: '';
}

.notification-type-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 12px;
  color: var(--PrimaryColor);
  background: color-mix(in srgb, var(--PrimaryColor) 8%, var(--surface-1));
}

.notification-type-icon svg {
  width: 19px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.6;
}

.notification-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
}

.notification-title-row {
  display: flex;
  align-items: center;
  min-width: 0;
  gap: 7px;
}

.notification-title-row strong {
  overflow: hidden;
  color: var(--text-strong);
  font-size: 0.72rem;
  font-weight: 850;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-title-row i {
  width: 7px;
  height: 7px;
  flex: 0 0 7px;
  border-radius: 50%;
  background: var(--PrimaryColor);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--PrimaryColor) 10%, transparent);
}

.notification-copy p {
  display: -webkit-box;
  overflow: hidden;
  margin: 3px 0 6px;
  color: var(--text-soft);
  font-size: 0.64rem;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.notification-copy small {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--text-muted, var(--text-soft));
  font-size: 0.55rem;
}

.notification-copy small svg {
  width: 12px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.notification-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 25px;
  align-self: center;
  border-radius: 8px;
  color: var(--text-soft);
  background: var(--surface-2);
  transition:
    color 0.18s ease,
    background 0.18s ease;
}

.notification-arrow svg {
  width: 13px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.8;
}

.notification-card:hover .notification-arrow {
  color: var(--text-on-brand);
  background: var(--PrimaryColor);
}

.notification-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 245px;
  flex-direction: column;
  padding: 30px;
  text-align: center;
}

.empty-orbit {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 68px;
  height: 68px;
  margin-bottom: 13px;
  border: 1px dashed color-mix(in srgb, var(--status-success) 32%, var(--main-border));
  border-radius: 50%;
  color: var(--status-success);
  background: color-mix(in srgb, var(--status-success) 7%, transparent);
}

.empty-orbit::before {
  position: absolute;
  inset: 7px;
  border: 1px solid color-mix(in srgb, var(--status-success) 12%, transparent);
  border-radius: 50%;
  content: '';
}

.empty-orbit svg {
  z-index: 1;
  width: 29px;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 1.5;
}

.notification-empty strong {
  color: var(--text-strong);
  font-family: 'Bold';
  font-size: 0.82rem;
}

.notification-empty p {
  max-width: 245px;
  margin: 5px 0 0;
  color: var(--text-soft);
  font-size: 0.64rem;
  line-height: 1.55;
}

.notification-panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 18px;
  border-top: 1px solid var(--main-border);
  color: var(--text-soft);
  background: color-mix(in srgb, var(--surface-2) 54%, transparent);
  font-size: 0.57rem;
}

.notification-panel-footer span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.notification-panel-footer span i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--status-success);
}

:global([dir='rtl']) .notification-card:hover {
  transform: translateX(-2px);
}

:global([dir='rtl']) .notification-arrow svg {
  transform: rotate(180deg);
}

:global([data-theme='dark'] .notification-popover.p-popover) {
  border-color: var(--text-muted) !important;
  background: var(--surface-1) !important;
  box-shadow: 0 28px 70px color-mix(in srgb, var(--text-strong) 34%, transparent) !important;
}

@media (max-width: 480px) {
  .notification-panel {
    width: calc(100vw - 18px);
  }

  .notification-panel-header {
    padding-inline: 14px;
  }

  .unread-summary {
    padding: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .notification,
  .notification-count,
  .status-dot,
  .notification-card {
    animation: none;
    transition: none;
  }
}
</style>
