import type Params from '@/base/core/params/params'

export default class IndexSystemTeamParams implements Params {
  public isSystemOnly: boolean

  constructor(isSystemOnly: boolean = true) {
    this.isSystemOnly = isSystemOnly
  }

  toMap(): Record<string, boolean> {
    return {
      is_system_only: this.isSystemOnly,
    }
  }
}
