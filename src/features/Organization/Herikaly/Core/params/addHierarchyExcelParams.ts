import type Params from '@/base/core/params/params'

interface Data {
  title: string
}
export default class AddHierarchyExcelParams implements Params {
  data: Data[]

  constructor(data: { data: Data[] }) {
    this.data = data.data
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['data'] = this.data
    return data
  }
}
