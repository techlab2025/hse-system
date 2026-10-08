import type Params from '@/base/core/params/params'

export default class CreateAttachmentMatrixParams implements Params {
  constructor(
    public hse_policy: string[],
    public sos: string[],
    public standerd_policy: string[],
  ) {}

  toMap(): Record<string, string[]> {
    return {
      hse_policy: this.hse_policy,
      sos: this.sos,
      standerd_policy: this.standerd_policy,
    }
  }
}
