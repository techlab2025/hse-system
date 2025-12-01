import type Params from '@/base/core/params/params'

export default class FetchMyProjectsParams implements Params {
  // public preventive: string
  constructor() // preventive: string
  {
    // this.preventive = preventive
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    // data['preventive'] = this.preventive
    return data
  }
}
