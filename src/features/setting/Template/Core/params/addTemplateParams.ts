import type Params from '@/base/core/params/params'
import type TranslationsParams from '@/base/core/params/translations_params.ts'
import { ActionsEnum } from '../Enum/ActionType'
import type AddTemplateItemParams from '@/features/setting/TemplateItem/Core/params/addTemplateItemParams'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class AddTemplateParams implements Params {
  translation: TranslationsParams
  allIndustries: boolean | null
  industries: number[]
  require_image: number
  action: ActionsEnum | null
  items: AddTemplateItemParams[] = []
  template_type: number | null
  isInLiberary: number | null

  public static readonly validation = new ClassValidation().setRules({
    translation: { required: true, minLength: 2, maxLength: 100 },
    // items: { required: true },
  })

  constructor(
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    require_image: number,
    action: ActionsEnum | null,
    items: AddTemplateItemParams[] = [],
    template_type: number | null,
    isInLiberary: number | null,
  ) {
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.require_image = require_image
    this.items = items
    this.action = action
    this.template_type = template_type
    this.isInLiberary = isInLiberary
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
    if (this.items.length > 0 && this.action != ActionsEnum.TextArea) {
      data['items'] = this.items.map((item) => item.toMap())
    }
    if (this.template_type != null) data['type'] = this.template_type
    if (this.isInLiberary != null) data['is_in_library'] = this.isInLiberary
    return data
  }
  validate() {
    return AddTemplateParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddTemplateParams.validation.validateOrThrow(this)
  }
}
