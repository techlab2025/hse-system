import type Params from '@/base/core/params/params'
export default class SentCopyActionParams implements Params {
  constructor(private currentPassword: string) {}
  toMap(): Record<string, unknown> {
    return { current_password: this.currentPassword }
  }
}
