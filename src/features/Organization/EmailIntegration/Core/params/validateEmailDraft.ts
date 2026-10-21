import type EmailIntegrationModel from '../../Data/models/EmailIntegrationModel'
import type { EmailDraft } from '../../Data/models/EmailIntegrationModel'

/** Returns a translation key; native form validation handles lengths and email syntax. */
export function validateEmailDraft(draft: EmailDraft, saved: EmailIntegrationModel): string | null {
  if (
    !['starttls', 'tls'].includes(draft.security) ||
    !(draft.security === 'tls' ? [465] : [587, 2525]).includes(Number(draft.port))
  )
    return 'invalidPort'
  if (
    !draft.host.trim() ||
    !draft.username.trim() ||
    !draft.from_email.trim() ||
    !draft.from_name.trim()
  )
    return 'requiredFields'
  if (!Object.values(draft.translations.from_name).some((name) => name.trim()))
    return 'senderRequired'
  const smtpChanged =
    draft.host.trim() !== saved.config.host || draft.username.trim() !== saved.config.username
  if ((!saved.has_password || smtpChanged) && !draft.password) return 'smtpPasswordRequired'
  const sent = draft.sent_copy
  if (sent.enabled) {
    if (!sent.host.trim()) return 'imapHostRequired'
    if (!sent.use_smtp_credentials) {
      if (!sent.username.trim()) return 'imapUserRequired'
      const changed =
        sent.host.trim() !== saved.config.sent_copy.host ||
        sent.username.trim() !== saved.config.sent_copy.username
      if ((!saved.has_imap_password || changed) && !sent.password) return 'imapPasswordRequired'
    }
  }
  return null
}
