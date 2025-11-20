import TitleInterface from '@/base/Data/Models/title_interface'
import TitleModel from '@/base/Data/Models/title_model.ts'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";
import TemplateItemDetailsModel from '@/features/setting/TemplateItem/Data/models/TemplateItemDetailsModel'
import { ActionsEnum } from '../../Core/Enum/ActionType'

export default class TemplateModel extends TitleInterface {
  public id: number
  // public hasCertificate: number
  public allIndustries: number
  public industries: TitleModel<string>[]
  public parentId: number
  public image: string

  // public titles: string
  public templateItems: TemplateItemDetailsModel[]
  public requireImage: number
  public action: TitleInterface | null

  constructor(
    id: number,
    title: string,
    subtitle: string,
    // hasCertificate: number,
    allIndustries: number,
    industries: TitleModel<string>[] = [],
    parentId: number,
    image: string,
    templateItems: TemplateItemDetailsModel[] = [],
    requireImage: number = 0,
    action: TitleInterface | null = null,

  ) {
    super({ id, title, subtitle })

    this.id = id
    // this.hasCertificate = hasCertificate
    this.allIndustries = allIndustries
    this.industries = industries
    this.parentId = parentId
    this.image = image
    this.templateItems = templateItems
    this.requireImage = requireImage
    this.action = action
  }

  static fromMap(data: any): TemplateModel {
    return new TemplateModel(
      data.id,
      data.title,
      data.subtitle,
      // data.has_certificate,
      data.all_industries,
      data.industries?.length > 0
        ? data.industries?.map((industry) => TitleModel.fromMap(industry))
        : [],
      data.parent_id,
      data.image,
      data.template_items?.length > 0 ? data.template_items.map((item) => TemplateItemDetailsModel.fromMap(item)) : [],
      data.require_image,
      this.getTemplateItemsAction(data.action),
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