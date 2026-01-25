import type Params from '@/base/core/params/params'

export default class CapaParams implements Params {
  public preventive: string
  public corrective: string
  public observationId: string
  constructor(preventive: string, corrective: string, observationId: string) {
    this.preventive = preventive
    this.corrective = corrective
    this.observationId = observationId
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['observation_id'] = this.observationId
    if (this.preventive) data['preventive'] = this.preventive
    if (this.corrective) data['corrective'] = this.corrective
    return data
  }
}
