import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddTraningTopicParams implements Params {
  static validation = new ClassValidation().setRules({
    translation: {
      required: true,
    },
  })

  constructor(
    public translation: TranslationsParams,
    public allIndustries: boolean | null = null,
    public industries: number[] = [],
  ) {}

  toMap(): Record<string, unknown> {
    const translations = this.translation.toMap() as Record<string, unknown>

    const data: Record<string, unknown> = {
      translations: translations,
    }
    if (this.allIndustries != null) {
      data.all_industries = this.allIndustries ? 1 : 0
      if (!this.allIndustries) data.industry_ids = this.industries
    }
    return data
  }

  validate() {
    return AddTraningTopicParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddTraningTopicParams.validation.validateOrThrow(this)
  }
}
