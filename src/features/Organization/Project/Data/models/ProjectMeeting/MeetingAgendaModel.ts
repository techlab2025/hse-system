
export default class MeeintgAgendaModel {
  public id: number
  public meetingId: number
  public text: string
  public status: number
  public type: number
  public createdAt: string

  constructor(data: {
    id: number
    meetingId: number
    text: string
    status: number
    type: number
    createdAt: string
  }) {
    this.id = data.id
    this.meetingId = data.meetingId
    this.text = data.text
    this.status = data.status
    this.type = data.type
    this.createdAt = data.createdAt
  }

  static fromMap(data: any): MeeintgAgendaModel {
    return new MeeintgAgendaModel({
      id: data.id,
      createdAt: data.created_at,
      meetingId: data.meeting_id,
      status: data.status,
      text: data.text,
      type: data.type,
    })
  }

  static example: MeeintgAgendaModel = new MeeintgAgendaModel({
    id: 11,
    createdAt: '',
    meetingId: 0,
    status: 1,
    text: '',
    type: 2,
  })
}
