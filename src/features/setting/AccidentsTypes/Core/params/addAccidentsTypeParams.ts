import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { useProjectAppStatusStore } from '@/stores/ProjectStatus'

export default class AddAccidentsTypeParams implements Params {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  serialNumber: string
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
  })

  constructor(
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    serialNumber: string,
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.serialNumber = serialNumber
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}

    data['translations'] = this.translation.toMap()
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    if (useProjectAppStatusStore().isSerialNumberAuto()) {
      data['serial_number'] = this.serialNumber
    } else {
      data['serial'] = this.serialNumber
    }

    return data
  }
  validate() {
    return AddAccidentsTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddAccidentsTypeParams.validation.validateOrThrow(this)
  }
}
