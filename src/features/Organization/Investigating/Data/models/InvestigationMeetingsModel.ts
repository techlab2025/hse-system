export default class InvestigationMeetingsModel {
  public id: number
  public status: number
  public date: string
  public time: string
  public type: number
  public meeting_link: string
  public corrective: string
  public place: string

  constructor(
    id: number,
    status: number,
    date: string,
    time: string,
    type: number,
    meeting_link: string,
    corrective: string,
    place: string,
  ) {
    this.id = id
    this.status = status
    this.date = date
    this.time = time
    this.type = type
    this.meeting_link = meeting_link
    this.corrective = corrective
    this.place = place
  }

  static fromMap(data: any): InvestigationMeetingsModel {
    return new InvestigationMeetingsModel(
      data.id,
      data.status,
      data.date,
      data.time,
      data.type,
      data.meeting_link,
      data.corrective,
      data.place,
    )
  }

  static example: InvestigationMeetingsModel = new InvestigationMeetingsModel(
    1,
    0,
    '2025-12-23',
    '17:57:50',
    1,
    '',
    'asdasdasda',
    '',
  )
}
