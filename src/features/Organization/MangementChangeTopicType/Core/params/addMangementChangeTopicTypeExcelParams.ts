import { applyLookupIndustryScope, type LookupIndustryFields } from '@/shared/utils/lookupIndustryScope'
import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

interface Data extends LookupIndustryFields {
  title: string
}
export default class AddMangementChangeTopicTypeExcelParams implements Params {
  public data: Data[]

  public static readonly validation = new ClassValidation("Organization/MangementChangeTopicType/Core/params/addMangementChangeTopicTypeExcelParams").setRules({
    // translation: { required: true, minLength: 2, maxLength: 100 },
  })
  constructor(data: { data: Data[] }, industryScope?: LookupIndustryFields) {
    this.data = applyLookupIndustryScope(data.data, industryScope)
  }

  toMap(): Record<string, any> {
    const data: Record<string, any> = {}
    data['data'] = this.data
    return data
  }

  // validate() {
  //   return AddPpeItemParams.validation.validate(this)
  // }

  // validateOrThrow() {
  //   return AddPpeItemParams.validation.validateOrThrow(this)
  // }
}
