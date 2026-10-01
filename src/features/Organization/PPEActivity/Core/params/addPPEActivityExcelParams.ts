import type Params from '@/base/core/params/params'

interface Data {
  title: string
}

export default class AddPPEActivityExcelParams implements Params {
  public data: Data[]

  constructor(data: { data: Data[] }) {
    this.data = data.data
  }

  toMap(): Record<string, any> {
    return { data: this.data }
  }
}
