import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import type FeaturesParams from './FeaturesParams'

export default class EditSystemComponentParams implements Params {
  id: number
  translation: TranslationsParams
  features: FeaturesParams[]

  constructor(id: number, translation: TranslationsParams, features: FeaturesParams[]) {
    this.id = id
    this.translation = translation
    this.features = features
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['our_system_component_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['features'] = this.features.map((feature) => feature.toMap())

    return data
  }
}
