import type Params from '@/base/core/params/params'

export default class ToggleObservationWorkStoppedParams implements Params {
  public observationId: number

  constructor(observationId: number) {
    this.observationId = observationId
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['observation_id'] = this.observationId
    return data
  }
}
