import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddServiceLogParams implements Params {
  translation: TranslationsParams
  serviceId: number
  constructor(translation: TranslationsParams, serviceId: number) {
    this.translation = translation
    this.serviceId = serviceId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()
    data['service_id'] = this.serviceId
    return data
  }
}
