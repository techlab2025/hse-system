import type Params from '@/base/core/params/params'

export default class FetchMyProjectsParams implements Params {
  // public preventive: string
  public allProject: boolean
  constructor(allProject: boolean) // preventive: string
  {
    this.allProject = allProject
  }

  toMap(): Record<string, number | string> {
    const data: Record<string, number | string> = {}
    // data['preventive'] = this.preventive
    return data
  }
}
