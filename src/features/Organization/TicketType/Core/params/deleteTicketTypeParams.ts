import type Params from '@/base/core/params/params'

export default class DeleteTicketTypeParams implements Params {
  constructor(public id: number) {
    this.id = id
  }

  toMap(): Record<string, number> {
    const data: Record<string, number> = {}
    data['ticket_type_id'] = this.id
    return data
  }
}
