import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'

export default class ReplaceTicketParams implements Params {
  public ticketId: number
  public reply: string

  public static readonly validation = new ClassValidation().setRules({
    ticketId: { required: true },
    reply: { required: true },
  })

  constructor(data: { ticketId: number; reply: string }) {
    this.ticketId = data.ticketId
    this.reply = data.reply
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    data['ticket_id'] = this.ticketId
    data['reply'] = this.reply
    return data
  }

  validate() {
    return ReplaceTicketParams.validation.validate(this)
  }
  validateOrThrow() {
    return ReplaceTicketParams.validation.validateOrThrow(this)
  }
}
