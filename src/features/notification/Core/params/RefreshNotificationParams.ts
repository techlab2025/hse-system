import type Params from '@/base/core/params/params'

export default class RefreshNotificationParams implements Params {

  constructor() {
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    return data
  }
}
