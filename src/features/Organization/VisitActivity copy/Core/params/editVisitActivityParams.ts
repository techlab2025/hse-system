import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'

export default class EditVisitActivityParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      visit_activity_id: this.id,
      translations: this.translation.toMap(),
    }
  }
}
