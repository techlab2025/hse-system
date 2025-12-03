import type Params from '@/base/core/params/params'

export default class CapaParams implements Params {
  public preventive: string
  public corrective: string
  constructor(preventive: string, corrective: string) {
    this.preventive = preventive
    this.corrective = corrective
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    data['preventive'] = this.preventive
    data['corrective'] = this.corrective
    return data
  }
}
