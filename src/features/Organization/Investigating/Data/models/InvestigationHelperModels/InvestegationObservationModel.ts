import acc from '@/assets/images/acc.png'

export default class InvestegationObservationModel {
  id: number
  description: string
  image: string
  isAction: boolean
  title: string
  type: string
  typeId: number

  constructor(
    id: number,
    description: string,
    image: string,
    isAction: boolean,
    title: string,
    type: string,
    typeId: number,
  ) {
    this.id = id
    this.description = description
    this.image = image
    this.isAction = isAction
    this.title = title
    this.type = type
    this.typeId = typeId
  }

  static fromMap(data: any): InvestegationObservationModel {
    return new InvestegationObservationModel(
      data.id,
      data.description,
      data.image,
      data.is_action,
      data.title,
      data.type,
      data.type_id,
    )
  }

  static example: InvestegationObservationModel = new InvestegationObservationModel(
    1,
    'description',
    acc,
    true,
    'title',
    '1',
    1,
  )
}
