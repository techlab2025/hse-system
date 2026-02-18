import TitleInterface from '@/base/Data/Models/title_interface'
import TemplateItemDetailsModel from '@/features/setting/TemplateItem/Data/models/TemplateItemDetailsModel'
import { ActionsEnum } from '../../Core/Enum/ActionType'

export default class TemplateItemTagModel {
  public id: number
  public templateItemTagId: number
  public title: string
  public templateItems: TemplateItemDetailsModel[]

  constructor(
    id: number,
    templateItemTagId: number,
    title: string,
    templateItems: TemplateItemDetailsModel[] = [],
  ) {
    this.id = id
    this.templateItemTagId = templateItemTagId
    this.title = title

    this.templateItems = templateItems
  }

  static fromMap(data: any): TemplateItemTagModel {
    return new TemplateItemTagModel(
      data.id,
      data.template_item_tag_id,
      data.title,
      data.template_items?.length > 0
        ? data.template_items.map((item) => TemplateItemDetailsModel.fromMap(item))
        : [],
    )
  }

  static getTemplateItemsAction(data: ActionsEnum): TitleInterface {
    switch (data) {
      case ActionsEnum.CheckBox:
        return new TitleInterface({
          id: ActionsEnum.CheckBox,
          title: 'Checkbox',
          subtitle: '',
        })
      default:
        return new TitleInterface({
          id: ActionsEnum.CheckBox,
          title: 'Unknown',
          subtitle: '',
        })
    }
  }
}
