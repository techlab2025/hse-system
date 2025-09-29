import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import type AddServiceFeatureParams from '@/features/website/ServiceFeature/Core/params/addServiceFeatureParams'

export default class EditServiceFeatureParams implements Params {
  id: number
  translation: TranslationsParams
  alt: string
  image: string
  items: AddServiceFeatureParams[]
  service_id?: number


  constructor(
    id: number,
    translation: TranslationsParams,
    alt: string,
    image: string,
    items: AddServiceFeatureParams[],
    service_id?: number,

  ) {
    this.id = id
    this.translation = translation
    this.alt = alt
    this.image = image
    this.items = items
    this.service_id = service_id
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['service_feature_id'] = this.id

    if (this.service_id) data['service_id'] = this.service_id

    data['translations'] = this.translation.toMap()

    data['alt'] = this.alt

    if (this.image && this.image.startsWith('data:image')) data['image'] = this.image

    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }

    return data
  }
}

