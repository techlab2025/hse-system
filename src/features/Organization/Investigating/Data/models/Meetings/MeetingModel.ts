export default class MeetingModel {
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

  static fromMap(data: any): MeetingModel {
    return new MeetingModel(
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

  static example: MeetingModel[] = [
    new MeetingModel(
      1,
      { id: 1, date: '2025-12-23', status: 0, type: 0 },
      1,
      '2025-12-23',
      '12:00',
      1,
      'meeting_link',
      'corrective',
    ),
    new MeetingModel(
      1,
      { id: 1, date: '2025-12-23', status: 0, type: 0 },
      2,
      '2025-12-23',
      '12:00',
      2,
      'meeting_link',
      'corrective',
    ),
    new MeetingModel(
      1,
      { id: 1, date: '2025-12-23', status: 0, type: 0 },
      1,
      '2025-12-23',
      '12:00',
      3,
      'meeting_link',
      'corrective',
    ),
    new MeetingModel(
      1,
      { id: 1, date: '2025-12-23', status: 0, type: 0 },
      2,
      '2025-12-23',
      '12:00',
      4,
      'meeting_link',
      'corrective',
    ),
  ]
}

interface investigationMeeting {
  id: number
  date: string
  status: number
  type: number
}
