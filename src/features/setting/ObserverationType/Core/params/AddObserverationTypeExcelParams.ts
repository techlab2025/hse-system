import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

interface Data {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  serialNumber: string
}
export default class AddObserverationTypeExcelParams implements Params {
  data: Data[]

  constructor(data: { data: Data[] }) {
    this.data = data.data
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}

    data['data'] = this.data

    return data
  }
}
