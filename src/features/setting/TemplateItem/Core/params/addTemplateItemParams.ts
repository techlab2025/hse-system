import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'

export default class AddTemplateItemParams implements Params {
  translation: TranslationsParams
  require_image: number
  action: number
  parentId: number
  AllIndustries: number

  constructor(
    translation: TranslationsParams,
    require_image: number,
    action: number,
    parentId: number,
    AllIndustries: number,
  ) {
    this.translation = translation
    this.require_image = require_image
    this.action = action
    this.parentId = parentId
    this.AllIndustries = AllIndustries
    // this.image = image
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

    data['translations'] = this.translation.toMap() // tranlations:asd
    if (this.parentId) data['template_id'] = this.parentId
    data['require_image'] = this.require_image
    if (this.action) data['action'] = this.action
    if (this.AllIndustries) data['all_industries'] = this.AllIndustries
    return data
  }
}
