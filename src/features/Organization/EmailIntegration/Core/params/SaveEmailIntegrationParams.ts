import type Params from '@/base/core/params/params'
import type {
  EmailConfig,
  EmailDraft,
  SentCopyConfig,
} from '../../Data/models/EmailIntegrationModel'

export interface SaveEmailIntegrationPayload {
  version: number
  enabled: boolean
  current_password: string
  config: EmailConfig & { password?: string; sent_copy: SentCopyConfig & { password?: string } }
}

export default class SaveEmailIntegrationParams implements Params {
  constructor(
    public version: number,
    public enabled: boolean,
    private currentPassword: string,
    private config: EmailDraft,
  ) {}
  toMap(): SaveEmailIntegrationPayload {
    const c = this.config
    const sent = c.sent_copy
    return {
      version: this.version,
      enabled: this.enabled,
      current_password: this.currentPassword,
      config: {
        host: c.host.trim(),
        port: Number(c.port),
        security: c.security,
        username: c.username.trim(),
        ...(c.password ? { password: c.password } : {}),
        from_email: c.from_email.trim(),
        from_name: c.from_name.trim(),
        reply_to: c.reply_to?.trim() || null,
        translations: {
          from_name: Object.fromEntries(
            Object.entries(c.translations.from_name).map(([language, name]) => [
              language,
              name.trim(),
            ]),
          ),
        },
        sent_copy: {
          enabled: sent.enabled,
          host: sent.host.trim(),
          port: 993,
          use_smtp_credentials: sent.use_smtp_credentials,
          username: sent.username.trim(),
          folder: sent.folder.trim(),
          ...(!sent.use_smtp_credentials && sent.password ? { password: sent.password } : {}),
        },
      },
    }
  }
}
