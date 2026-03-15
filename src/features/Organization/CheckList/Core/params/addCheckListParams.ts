import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddCheckListParams implements Params {
  public title: string

  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
  })
  constructor(data: { title: string }) {
    this.title = data.title
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}
    data['title'] = this.title
    return data
  }

  // validate() {
  //   return AddWhereHouseTypeParams.validation.validate(this)
  // }

  // validateOrThrow() {
  //   return AddWhereHouseTypeParams.validation.validateOrThrow(this)
  // }
}
