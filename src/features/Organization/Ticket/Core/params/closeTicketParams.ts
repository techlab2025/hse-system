import type Params from '@/base/core/params/params'
import { ClassValidation } from '@/base/Presentation/utils/class_validation'
import { StatusEnum } from '../Enums/statusEnum'
export default class CloseTicketParams implements Params {
  public ticketId: number
  public status: StatusEnum

  public static readonly validation = new ClassValidation().setRules({
    ticketId: { required: true },
    status: { required: true },
  })

  constructor(data: { ticketId: number; status: StatusEnum }) {
    this.ticketId = data.ticketId
    this.status = data.status
  }

  toMap(): Record<string, string | number | number[] | null> {
    const data: Record<string, string | number | number[] | null> = {}
    data['ticket_id'] = this.ticketId
    data['status'] = this.status
    return data
  }

  validate() {
    return CloseTicketParams.validation.validate(this)
  }
  validateOrThrow() {
    return CloseTicketParams.validation.validateOrThrow(this)
  }
}
