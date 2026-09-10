import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

interface Data {
  title: string
}
export default class AddWhereHouseTypeExcelParams implements Params {
  public data: Data[]

  public static readonly validation = new ClassValidation().setRules({
    // translation: { required: true, minLength: 2, maxLength: 100 },
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
  //   return AddWhereHouseTypeParams.validation.validate(this)
  // }

  // validateOrThrow() {
  //   return AddWhereHouseTypeParams.validation.validateOrThrow(this)
  // }
}
