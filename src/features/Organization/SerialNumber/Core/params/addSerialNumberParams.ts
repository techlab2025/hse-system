import type Params from '@/base/core/params/params'
import { SerialNumberEnum } from '../Enums/serialNum'

export default class AddSerialNumberParams implements Params {
  name: SerialNumberEnum
  prefix: string
  suffix: string
  start : string | number
  title : string


  constructor(name: SerialNumberEnum, prefix: string, suffix: string , start : string | number,title : string) {
    this.name = name
    this.prefix = prefix
    this.suffix = suffix
    this.start = start
    this.title = title
  }

  toMap(): Record<string, string | number[] | string[] | number | any | Record<string, string>> {
    const data: Record<
      string,
      string | number[] | number | string[] | any | Record<string, string>
    > = {}
    data['name'] = this.name
    data['prefix'] = this.prefix
    data['suffix'] = this.suffix
    data['start'] = this.start
    return data
  }


}
