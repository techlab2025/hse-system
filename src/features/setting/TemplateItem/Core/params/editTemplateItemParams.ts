import type Params from '@/base/core/params/params'


export default class implements Params {
  public templateItemId: number
  public TemplateId: number
  public title: string
  public type: number
  public answers: items[]
  public isImageRequired: number
  public imageType: number

  constructor(
    templateItemId: number,
    TemplateId: number,
    title: string,
    type: number,
    answers: items[],
    isImageRequired: number,
    imageType: number,
  ) {
    this.templateItemId = templateItemId
    this.TemplateId = TemplateId
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
    data['template_item_id'] = this.templateItemId
    data['template_id'] = this.TemplateId
    data['name'] = this.title
    data['action'] = this.type
    data['items'] = this.answers.map((item) => ({
      title: item.title,
      is_danger: item.is_danger ? 1 : 0,
    }))
    data['require_image'] = this.isImageRequired
    data['required_type'] = this.imageType

    return data
  }
}
interface items {
  title: string
  is_danger: boolean
}
