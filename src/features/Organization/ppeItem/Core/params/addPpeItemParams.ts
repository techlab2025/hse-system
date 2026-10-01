import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddPpeItemParams implements Params {
  constructor(
    public translation: TranslationsParams,
    public allIndustries: boolean | null = null,
    public industries: number[] = [],
  ) {}

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
  })

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = { translations: this.translation.toMap() }
    if (this.allIndustries != null) {
      data.all_industries = this.allIndustries ? 1 : 0
      if (!this.allIndustries) data.industry_ids = this.industries
    }
    return data
  }

  validate() {
    return AddPpeItemParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddPpeItemParams.validation.validateOrThrow(this)
  }
}
