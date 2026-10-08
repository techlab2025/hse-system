import type Params from '@/base/core/params/params'

export interface Data {
  title: string
}

export default class AddTraningTopicExcelParams implements Params {
  public data: Data[]

  constructor(data: { data: Data[] }) {
    this.data = data.data
  }

  toMap(): Record<string, Data[]> {
    return {
      data: this.data,
    }
  }
}
