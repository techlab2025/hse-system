import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import MeeintgAgendaModel from './MeetingAgendaModel'
import MeetingActionsModel from './MeetingActionsModel'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class ProjectMeetingDetails {
  public id: number
  public meetingId: number
  public hasResult: boolean
  public date: string
  public time: string
  public content: string
  public hierarchies: TitleInterface[]
  public teamLeader: OrganizatoinEmployeeModel
  public serialName: string
  public meetingAgenda: MeeintgAgendaModel[]
  public MeetingActions: MeetingActionsModel[]

  constructor(data: {
    id: number
    meetingId: number
    hasResult: boolean
    date: string
    time: string
    content: string
    hierarchies: TitleInterface[]
    teamLeader: OrganizatoinEmployeeModel
    serialName: string
    meetingAgenda: MeeintgAgendaModel[]
    MeetingActions: MeetingActionsModel[]
  }) {
    this.id = data.id
    this.meetingId = data.meetingId
    this.hasResult = data.hasResult
    this.date = data.date
    this.time = data.time
    this.content = data.content
    this.serialName = data.serialName
    this.teamLeader = data.teamLeader
    this.hierarchies = data.hierarchies
    this.meetingAgenda = data.meetingAgenda
    this.MeetingActions = data.MeetingActions
  }

  static fromMap(data: any): ProjectMeetingDetails {
    return new ProjectMeetingDetails({
      id: data.id,
      meetingId: data.meeting_id,
      hasResult: data.hasr_result,
      date: data.date,
      time: data.time,
      content: data.content,
      hierarchies: data.hierarchies,
      teamLeader: data.team_leader ? OrganizatoinEmployeeModel.fromMap(data.team_leader) : {},
      serialName: data.serial_name,
      meetingAgenda: Array.isArray(data.meeting_agenda)
        ? data.meeting_agenda.map((el) => MeeintgAgendaModel.fromMap(el))
        : [],
      MeetingActions: Array.isArray(data.meeting_actions)
        ? data.meeting_actions.map((el) => MeetingActionsModel.fromMap(el))
        : [],
    })
  }

  static example: ProjectMeetingDetails = new ProjectMeetingDetails({
    id: 1,
    meetingId: 2,
    hasResult: true,
    date: '',
    time: '',
    content: '',
    hierarchies: [new TitleInterface({ id: 1, title: 'as' })],
    teamLeader: OrganizatoinEmployeeModel.exampl2,
    serialName: '',
    meetingAgenda: [MeeintgAgendaModel.example],
    MeetingActions: [MeetingActionsModel.example],
  })
}
