import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditAccidentsTypeParams implements Params {
  id: number
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  isLossTime: boolean
  isFalilty: boolean
  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true },
  })
  constructor(
    id: number,
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    isLossTime: boolean,
    isFalilty: boolean,
  ) {
    this.id = id
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.isLossTime = isLossTime
    this.isFalilty = isFalilty
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['accidents_type_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries
    data['is_loss_time'] = this.isLossTime ? 1 : 0
    data['is_falilty'] = this.isFalilty ? 1 : 0

    return data
  }

  validate() {
    return EditAccidentsTypeParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditAccidentsTypeParams.validation.validateOrThrow(this)
  }
}
