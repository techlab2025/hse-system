import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddFactoryItemParams implements Params {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  factoryId: number
  serialNumber: string

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    factoryId: { required: true },
  })
  constructor(
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    factoryId: number,
    serialNumber: string,
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.factoryId = factoryId
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
    data['factory_id'] = this.factoryId
    data['serial_number'] = Number(this.serialNumber)

    return data
  }

  validate() {
    console.log(AddFactoryItemParams.validation.validate(this), 'validate')
    return AddFactoryItemParams.validation.validate(this)
  }

  validateOrThrow() {
    console.log('validateOrThrow')
    return AddFactoryItemParams.validation.validateOrThrow(this)
  }
}
