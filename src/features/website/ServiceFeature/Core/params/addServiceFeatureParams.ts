import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type ItemParams from './ItemParams'

export default class AddServiceFeatureParams implements Params {
  serviceId: number
  translation: TranslationsParams
  items: ItemParams[]

  constructor(
    serviceId: number,
    translation: TranslationsParams,
    items: ItemParams[],
  ) {
    this.serviceId = serviceId
    this.translation = translation
    this.items = items
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['service_id'] = this.serviceId
    data['translations'] = this.translation.toMap()
    data['items'] = this.items

    return data
  }
}
