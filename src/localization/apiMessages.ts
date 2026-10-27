import { translate } from './i18n'
const codes: Record<string, string> = {
  UNAUTHENTICATED: 'network.unauthorized',
  UNAUTHORIZED: 'network.unauthorized',
  FORBIDDEN: 'network.forbidden',
  NOT_FOUND: 'network.notFound',
  VALIDATION_ERROR: 'network.validation',
  VALIDATION_FAILED: 'network.validation',
  TOO_MANY_REQUESTS: 'network.rateLimit',
  INTERNAL_SERVER_ERROR: 'network.server',
  SERVICE_UNAVAILABLE: 'network.unavailable',
}
const knownMessages: Record<string, string> = {
  unauthenticated: 'network.unauthorized',
  unauthorized: 'network.unauthorized',
  forbidden: 'network.forbidden',
  'not found': 'network.notFound',
  'too many requests': 'network.rateLimit',
  'internal server error': 'network.server',
  'service unavailable': 'network.unavailable',
  'network error': 'network.connection',
  'request timeout': 'network.timeout',
}
/** Translate stable codes and standard errors; retain meaningful unknown server messages. */
export const localizedApiMessage = (payload: { code?: unknown; message?: unknown } | undefined) => {
  const key = typeof payload?.code === 'string' ? codes[payload.code.toUpperCase()] : undefined
  if (key) return translate(key)
  if (typeof payload?.message !== 'string') return undefined
  const message = payload.message.trim()
  const known = knownMessages[message.toLowerCase().replace(/\.$/, '')]
  if (known) return translate(known)
  if (/^(?:SQLSTATE\[|(?:Type|Reference|Syntax)Error:|Stack trace:)/i.test(message))
    return translate('network.server')
  return message || undefined
}
