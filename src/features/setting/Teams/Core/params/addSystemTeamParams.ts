import type Params from '@/base/core/params/params'

export default class AddSystemTeamParams implements Params {
  public cloneIds: number[]

  constructor(data: { cloneIds: number[] }) {
    this.cloneIds = data.cloneIds
  }

  toMap(): Record<string, number[]> {
    return {
      clones_ids: this.cloneIds,
    }
  }
}
