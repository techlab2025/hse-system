import type AttachmentModel from '@/base/Data/Models/attachment_model'
import TitleInterface from '@/base/Data/Models/title_interface'
import type { UserTypeEnum } from '../../../../../../../orbit-client/src/features/Organization/Tickets/Core/Enum/userTypeEnum'
import type { StatusEnum } from '../../../../../../../orbit-client/src/features/Organization/Tickets/Core/Enum/statusEnum'

export default class TicketHistoryModel extends TitleInterface {
  public id: number
  public reply: string
  public createdAt: string
  public attachments?: AttachmentModel[]
  public userType: UserTypeEnum
  public status: number

  constructor(data: {
    id: number
    reply: string
    createdAt: string
    attachments?: AttachmentModel[]
    userType: UserTypeEnum
    status: number
  }) {
    super({ id: data.id, title: '' })
    this.id = data.id
    this.reply = data.reply
    this.createdAt = data.createdAt
    this.attachments = data.attachments
    this.userType = data.userType
    this.status = data.status
  }

  static fromMap(data: any): TicketHistoryModel {
    // console.log('ProjectModel data:', data)
    return new TicketHistoryModel({
      id: data.id,
      reply: data.reply,
      createdAt: data.created_at,
      attachments: data.attachments,
      userType: data.user_type,
      status: data.status,
    })
  }
}
