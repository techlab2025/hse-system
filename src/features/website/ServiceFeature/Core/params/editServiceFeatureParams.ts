import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import type ItemParams from './ItemParams'

export default class EditServiceFeatureParams implements Params {
  id: number
  serviceId: number
  translation: TranslationsParams
  items: ItemParams[]

  constructor(id: number, serviceId: number, translation: TranslationsParams, items: ItemParams[]) {
    this.id = id
    this.serviceId = serviceId
    this.translation = translation
    this.items = items
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['service_feature_id'] = this.id
    data['service_id'] = this.serviceId
    data['translations'] = this.translation.toMap()
    data['items'] = this.items

    return data
  }
}
