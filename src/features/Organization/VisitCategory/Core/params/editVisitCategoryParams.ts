import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'

export default class EditVisitCategoryParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      leadership_category_id: this.id,
      translations: this.translation.toMap(),
    }
  }
}
