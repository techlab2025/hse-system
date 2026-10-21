import type { SentCopyCounts } from './EmailIntegrationModel'

export default class SentCopyResultModel {
  constructor(
    public folder: string,
    public sent_copies: SentCopyCounts | null,
  ) {}
  static fromMap(input: Record<string, unknown>) {
    const value = input as Partial<SentCopyResultModel>
    return new SentCopyResultModel(
      value.folder ?? '',
      value.sent_copies
        ? {
            saved: value.sent_copies.saved ?? 0,
            pending: value.sent_copies.pending ?? 0,
            failed: value.sent_copies.failed ?? 0,
          }
        : null,
    )
  }
}
