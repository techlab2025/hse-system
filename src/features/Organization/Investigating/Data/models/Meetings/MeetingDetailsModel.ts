export default class MeetingDetailsModel {
  public id: number
  public investigation: investigationMeeting
  public status: number
  public date: string
  public time: string
  public type: number
  public meeting_link: string
  public corrective: string

  constructor(
    id: number,
    investigation: investigationMeeting,
    status: number,
    date: string,
    time: string,
    type: number,
    meeting_link: string,
    corrective: string,
  ) {
    this.id = id
    this.investigation = investigation
    this.status = status
    this.date = date
    this.time = time
    this.type = type
    this.meeting_link = meeting_link
    this.corrective = corrective
  }

  static fromMap(data: any): MeetingDetailsModel {
    return new MeetingDetailsModel(
      data.id,
      data.investigation,
      data.status,
      data.date,
      data.time,
      data.type,
      data.meeting_link,
      data.corrective,
    )
  }

  static example: MeetingDetailsModel = new MeetingDetailsModel(
    1,
    { id: 1, date: '2025-12-23', status: 0, type: 0 },
    0,
    '2025-12-23',
    '12:00',
    0,
    'meeting_link',
    'corrective',
  )
}

interface investigationMeeting {
  id: number
  date: string
  status: number
  type: number
}
