import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
interface Data {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  serialNumber: string
}
export default class AddAccidentsTypeExcelParams implements Params {
  data: Data[]
  public static readonly validation = new ClassValidation().setRules({})

  constructor(data: { data: Data[] }) {
    this.data = data.data
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}

    data['data'] = this.data

    return data
  }
}
