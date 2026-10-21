export interface SentCopyConfig {
  enabled: boolean
  host: string
  port: 993
  use_smtp_credentials: boolean
  username: string
  folder: string
}
export interface EmailConfig {
  host: string
  port: number
  security: 'starttls' | 'tls'
  username: string
  from_email: string
  from_name: string
  reply_to: string | null
  translations: { from_name: Record<string, string> }
  sent_copy: SentCopyConfig
}
export interface SentCopyCounts {
  pending: number
  failed: number
  saved: number
}
export interface EmailDraft extends EmailConfig {
  password: string
  sent_copy: SentCopyConfig & { password: string }
}
export default class EmailIntegrationModel {
  constructor(
    public version: number,
    public enabled: boolean,
    public status: string,
    public updated_at: string | null,
    public has_password: boolean,
    public has_imap_password: boolean,
    public config: EmailConfig,
    public sent_copies: SentCopyCounts,
    public can_manage: boolean,
  ) {}

  static fromMap(input: Record<string, unknown>): EmailIntegrationModel {
    const value = input as Partial<EmailIntegrationModel>
    const config: Partial<EmailConfig> = value.config ?? {}
    const sent: Partial<SentCopyConfig> = config.sent_copy ?? {}
    // Explicit allowlist: passwords must never become response model properties.
    return new EmailIntegrationModel(
      value.version ?? 0,
      value.enabled === true,
      value.status ?? 'not_configured',
      value.updated_at ?? null,
      value.has_password === true,
      value.has_imap_password === true,
      {
        host: config.host ?? '',
        port: config.port ?? 587,
        security: config.security === 'tls' ? 'tls' : 'starttls',
        username: config.username ?? '',
        from_email: config.from_email ?? '',
        from_name: config.from_name ?? '',
        reply_to: config.reply_to ?? null,
        translations: {
          from_name: {
            ...Object.fromEntries(
              Object.entries(config.translations?.from_name ?? {}).filter(
                ([, name]) => typeof name === 'string',
              ),
            ),
            ar: config.translations?.from_name?.ar ?? '',
            en: config.translations?.from_name?.en ?? '',
          },
        },
        sent_copy: {
          enabled: sent.enabled === true,
          host: sent.host ?? '',
          port: 993,
          use_smtp_credentials: sent.use_smtp_credentials !== false,
          username: sent.username ?? '',
          folder: sent.folder ?? '',
        },
      },
      {
        pending: value.sent_copies?.pending ?? 0,
        failed: value.sent_copies?.failed ?? 0,
        saved: value.sent_copies?.saved ?? 0,
      },
      value.can_manage === true,
    )
  }

  toDraft(): EmailDraft {
    return {
      ...this.config,
      password: '',
      translations: { from_name: { ...this.config.translations.from_name } },
      sent_copy: { ...this.config.sent_copy, password: '' },
    }
  }
}
