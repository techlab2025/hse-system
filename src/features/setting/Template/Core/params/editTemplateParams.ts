import type Params from '@/base/core/params/params.ts'
import TranslationsParams from '@/base/core/params/translations_params.ts'
import type AddTemplateParams from './addTemplateParams'
// import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class EditTemplateParams implements Params {
  id: number
  translation: TranslationsParams
  public allIndustries: boolean | null
  industries: number[]
  image: string
  items: AddTemplateParams[]
  template_type: number | null

  // public static readonly validation = new ClassValidation().setRules({
  //   industries: { required: true, custom: () => this.allIndustries != null },
  // })

  constructor(
    id: number,
    translation: TranslationsParams,
    allIndustries: boolean | null,
    industries: number[],
    image: string,
    items: AddTemplateParams[],
    template_type: number | null,
  ) {
    this.id = id
    this.translation = translation
    this.allIndustries = allIndustries
    this.industries = industries
    this.image = image
    this.items = items
    this.template_type = template_type
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<string, any> = {}

    data['template_id'] = this.id
    data['translations'] = this.translation.toMap()
    if (this.allIndustries != null) data['all_industries'] = this.allIndustries ? 1 : 0
    if (!this.allIndustries) data['industry_ids'] = this.industries

    data['image'] = this.image

    if (this.items.length > 0) {
      data['items'] = this.items.map((item) => item.toMap())
    }
    if (this.template_type != null) data['type'] = this.template_type
    return data
  }
  // validate() {
  //   return EditTemplateParams.validation.validate(this)
  // }

  // validateOrThrow() {
  //   return EditTemplateParams.validation.validateOrThrow(this)
  // }
}
