import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class EditInductionParams implements Params {
  constructor(
    public id: number,
    public translation: TranslationsParams,
  ) {}

  toMap(): Record<string, unknown> {
    const translations = this.translation.toMap() as Record<string, unknown>

    return {
      Induction_id: this.id,
      translations: translations,
    }
  }
}
