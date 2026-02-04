import TitleInterface from '@/base/Data/Models/title_interface'
import type { StatusEnum } from '../../Core/Enums/statusEnum'
import type TitleModel from '@/base/Data/Models/title_model'
// import ClientCategoryModel from "@/features/dashboard/settings/clientCategory/Data/models/index_client_category_model";

export default class TicketModel extends TitleInterface {
  public id: number
  public title: string
  public description: string
  public type: string
  public media: string[]
  public status: StatusEnum
  public created_at: string
  public ticketType: TitleModel<string | number | null>

  constructor(
    id: number,
    title: string,
    description: string,
    type: string, 
    media: string[],
    status: StatusEnum,
    created_at: string,
    ticketType: TitleModel<string | number | null>,
  ) {
    super({ id: id, title: title })

    this.id = id
    this.title = title
    this.description = description
    this.type = type
    this.media = media
    this.status = status
    this.created_at = created_at
    this.ticketType = ticketType
  }

  static fromMap(data: any): TicketModel {
    return new TicketModel(
      data.id,
      data.title,
      data.description,
      data.type,
      data.media,
      data.status,
      data.created_at,
      data.ticket_type,
    )
  }
}
