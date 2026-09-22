import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditTraningTopicParams implements Params {
  static validation = new ClassValidation().setRules({
    id: { required: true },
    translation: { required: true },
  })

  constructor(
    public id: number,
    public translation: TranslationsParams,
    public allIndustries: boolean | null = null,
    public industries: number[] = [],
  ) {}

  toMap(): Record<string, unknown> {
    const translations = this.translation.toMap() as Record<string, unknown>

    const data: Record<string, unknown> = {
      traning_topic_id: this.id,
      translations: translations,
    }
    if (this.allIndustries != null) {
      data.all_industries = this.allIndustries ? 1 : 0
      if (!this.allIndustries) data.industry_ids = this.industries
    }
    return data
  }

  validate() {
    return EditTraningTopicParams.validation.validate(this)
  }

  validateOrThrow() {
    return EditTraningTopicParams.validation.validateOrThrow(this)
  }
}
