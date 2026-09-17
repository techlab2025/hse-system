import type Params from '@/base/core/params/params'

export default class IndexOwnTaskParams implements Params {
  public id: number 
  public type?: number 

  constructor(
    id: number,
    type?: number,
  ) {
    this.id = id
    this.type = type
    // this.code = code
  }

  toMap(): Record<string, string | number | number[] | boolean | null> {
    const data: Record<string, string | number | number[] | boolean | null> = {}
    if (this.id) data['id'] = this.id
    if (this.type != null) data['type'] = Number(this.type)
    // if (this.code) data['code'] = this.code
    return data
  }
}
