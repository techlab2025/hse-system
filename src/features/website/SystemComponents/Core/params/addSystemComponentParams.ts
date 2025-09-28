import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type FeaturesParams from './FeaturesParams'

export default class AddSystemComponentParams implements Params {
  translation: TranslationsParams
  features: FeaturesParams[]

  constructor(translation: TranslationsParams, features: FeaturesParams[]) {
    this.translation = translation
    this.features = features
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()
    data['features'] = this.features.map((feature) => feature.toMap())

    return data
  }
}
