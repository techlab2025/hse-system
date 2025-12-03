import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddTemplateItemParams implements Params {
  id:number
  translation: TranslationsParams
  type: number
  answers: number
  isImageRequired: number
  imageType: number

  constructor(
    id: number,
    translation: TranslationsParams,
    type: number,
    answers: number,
    isImageRequired: number,
    imageType: number,
  ) {
    this.id = id
    this.translation = translation
    this.type = type
    this.answers = answers
    this.isImageRequired = isImageRequired
    this.imageType = imageType
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
    > = {}
    data['template_id'] = this.id
    data['translations'] = this.translation.toMap() // tranlations:asd
    data['action'] = this.type
    data['answers'] = this.answers
    data['is_image_required'] = this.isImageRequired
    data['image_type'] = this.imageType
    return data
  }
}
