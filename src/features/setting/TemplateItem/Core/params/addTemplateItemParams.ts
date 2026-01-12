import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { TextAreaStatusEnum } from '../Enum/TextAreaStatusEnum'

export default class AddTemplateItemParams implements Params {
  id: number
  title: string
  type: number
  answers: items[]
  isImageRequired: number
  imageType: number
  public static readonly validation = new ClassValidation().setRules({
    title: { required: true, minLength: 2, maxLength: 100 },
    
  })
  constructor(
    id: number,
    title: string,
    type: number,
    answers: items[],
    isImageRequired: number,
    imageType: number,
  ) {
    this.id = id
    this.title = title
    this.type = type
    this.answers = answers
    this.isImageRequired = isImageRequired
    this.imageType = imageType
  }

  toMap(): Record<
    string,
    | number
    | string
    | number[]
    | Record<string, string | number[] | number | Record<string, string>>
    | Array<Record<string, string | number>>
  > {
    const data: Record<
      string,
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
    data['options'] = this.answers.map((item) => ({
      title: item.title,
      is_upload: item.isDanger ? 1 : 0,
      textarea_type: item?.normal_textarea
        ? item?.textarea_type
        : item?.isTextAreaRequired
          ? item.textarea_type
            ? TextAreaStatusEnum.required
            : TextAreaStatusEnum.optional
          : 0,
      has_auto_observation: item.has_auto_observation ? 1 : 0,
    }))
    data['require_image'] = this.isImageRequired || 0
    data['required_type'] = this.imageType || 0
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
  isDanger: boolean
  isTextAreaRequired: boolean
  textarea_type: number
  has_auto_observation: boolean
  normal_textarea?: boolean
}
