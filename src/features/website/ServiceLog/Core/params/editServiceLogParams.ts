import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import type ItemParams from './ItemParams'

export default class EditServiceLogParams implements Params {
  id: number
  translation: TranslationsParams
  serviceId: number

  constructor(id: number, translation: TranslationsParams, serviceId: number) {
    this.id = id
    this.translation = translation
    this.serviceId = serviceId
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['service_log_id'] = this.id
    data['translations'] = this.translation.toMap()
    data['service_id'] = this.serviceId

    return data
  }
}
