import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import type { ActionsEnum } from '../Enum/ActionType'

export default class AddTemplateParams implements Params {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  require_image: number
  action: ActionsEnum | null
  items: AddTemplateParams[] = []
  template_type: number | null

  constructor(
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    require_image: number,
    action: ActionsEnum | null,
    items: AddTemplateParams[] = [],
    template_type: number | null,
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.require_image = require_image
    this.items = items
    this.action = action
    this.template_type = template_type
  }

  toMap(): Record<string, unknown> {
    const data: Record<string, unknown> = {}
    data['translations'] = this.translation.toMap()
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0

    if (!this.allIndustries) {
      data['industry_ids'] = this.industries
    }
    if (this.require_image != null) data['require_image'] = this.require_image
    if (this.action) data['action'] = this.action
    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }
    if (this.template_type != null) data['type'] = this.template_type
    return data
  }
  //   validate() {
  //   return AddTemplateParams.validation.validate(this)
  // }

  // validateOrThrow() {
  //   return AddTemplateParams.validation.validateOrThrow(this)
  // }
}
