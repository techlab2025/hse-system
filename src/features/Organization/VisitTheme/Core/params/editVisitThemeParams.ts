import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params'

export default class EditVisitThemeParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
  ) {}

  toMap(): Record<string, unknown> {
    return {
      leadership_theme_id: this.id,
      translations: this.translation.toMap(),
    }
  }
}
