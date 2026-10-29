import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { TextAreaStatusEnum } from '../Enum/TextAreaStatusEnum'
import { ActionsEnum } from '../Enum/ActionsEnum'

export default class AddTemplateItemParams implements Params {
  id: number | null
  title: string
  type: number
  answers: items[]
  isImageRequired: number
  imageType: number
  tag?: string
  needWorkingHourse: number | null
  needWorkingMillage: number | null

  public static readonly validation = new ClassValidation(
    'setting/TemplateItem/Core/params/addTemplateItemParams',
  ).setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
  })
  constructor(
    id: number | null,
    title: string,
    type: number,
    answers: items[],
    isImageRequired: number,
    imageType: number,
    tag?: string,
    needWorkingHourse: number | null = null,
    needWorkingMillage: number | null = null,
  ) {
    this.id = id
    this.title = title
    this.type = type
    this.answers = answers
    this.isImageRequired = isImageRequired
    this.imageType = imageType
    this.tag = tag
    this.needWorkingHourse = needWorkingHourse
    this.needWorkingMillage = needWorkingMillage
  }

  toMap(): Record<
    string,
    | null
    | boolean
    | number
    | string
    | number[]
    | Record<string, string | number[] | number | Record<string, string>>
    | Array<Record<string, string | number>>
  > {
    const data: Record<
      string,
      | null
      | boolean
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
      | Array<Record<string, string | number>>
    > = {}
    console.log(this.answers, 'this.answers')
    data['template_id'] = this.id
    data['name'] = this.title
    data['action'] = this.type
    if (this.type != ActionsEnum.TEXTAREA)
      data['options'] = this.answers.map((item) => ({
        title: item.title,
        is_upload: item.is_upload ? 1 : 0,
        textarea_type: item.has_auto_observation
          ? TextAreaStatusEnum.required
          : item?.normal_textarea
            ? item?.textarea_type
            : item?.isTextAreaRequired
              ? item.textarea_type
                ? TextAreaStatusEnum.required
                : TextAreaStatusEnum.optional
              : 0,
        has_auto_observation: item.has_auto_observation ? 1 : 0,
      }))
    data['require_image'] = this.isImageRequired || 0
    data['required_type'] = Number(this.imageType) || 0
    // Template details expose questions through named groups; an empty tag hides them.
    data['template_item_tag'] = this.tag?.trim() || 'General'
    if (this.needWorkingHourse != null)
      data['need_working_hourse'] = Boolean(this.needWorkingHourse)
    if (this.needWorkingMillage != null)
      data['need_working_millage'] = Boolean(this.needWorkingMillage)
    return data
  }

  validate() {
    return AddTemplateItemParams.validation.validate(this)
  }

  validateOrThrow() {
    return AddTemplateItemParams.validation.validateOrThrow(this)
  }
}

interface items {
  title: string
  is_upload: boolean
  isTextAreaRequired: boolean
  textarea_type: number
  has_auto_observation: boolean
  normal_textarea?: boolean
}
