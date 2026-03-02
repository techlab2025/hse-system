import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

interface Data {
  translation: TranslationsParams
  hasCertificate: number
  allIndustries: number | null
  industries: number[]
  parentId: number
  image: string
  type: number
}
export default class AddEquipmentTypeExcelParams implements Params {
  public data: Data[]
  public static readonly validation = new ClassValidation().setRules({
    // translation: { required: true },
    // type: { required: true },
  })
  constructor(data: { data: Data[] }) {
    this.data = data.data
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}
    data['data'] = this.data
    return data
  }

  // validate() {
  //   return AddEquipmentTypeParams.validation.validate(this)
  // }

  // validateOrThrow() {
  //   return AddEquipmentTypeParams.validation.validateOrThrow(this)
  // }
}
