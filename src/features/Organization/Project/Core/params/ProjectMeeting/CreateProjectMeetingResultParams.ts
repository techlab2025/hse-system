import type Params from '@/base/core/params/params'
import type CreateProjectMeetingActionsParams from './ProjectMeetingActionsParams'

export default class CreateProjectMeetingResultParams implements Params {
  public projectId: number
  public MeetingId: number
  public agenda: string[]
  public meetingActions: CreateProjectMeetingActionsParams[]

  constructor(data: {
    projectId: number
    MeetingId: number
    agenda: string[]
    meetingActions: CreateProjectMeetingActionsParams[]
  }) {
    this.projectId = data.projectId
    this.MeetingId = data.MeetingId
    this.agenda = data.agenda
    this.meetingActions = data.meetingActions
  }

  toMap(): Record<
    string,
    number | string | number[] | Record<string, string | number[] | number | Record<string, string>>
  > {
    const data: Record<
      string,
      | number
      | string
      | number[]
      | Record<string, string | number[] | number | Record<string, string>>
      | any
    > = {}

    data['project_id'] = this.projectId
    data['meeting_id'] = this.MeetingId
    data['agenda'] = this.agenda
    data['meeting_actions'] = this.meetingActions.map((el) => el.toMap())

    return data
  }
}
