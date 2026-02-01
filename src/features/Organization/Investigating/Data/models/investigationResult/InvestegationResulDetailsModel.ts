import TitleInterface from '@/base/Data/Models/title_interface'
import HazardModel from '@/features/Organization/ObservationFactory/Data/models/hazardModel'
import InvestegationEmployeeModel from './InvestegationEmployeeModel'
import MeetingModel from '../Meetings/MeetingModel'

export default class InvestegationResultDetailsModel {
  public id: number
  public date: string
  public observation: HazardModel
  public status: number
  public type: number
  public title: string
  public serialNumber: string
  public investigationTeamLeader: TitleInterface
  public investigationEmployees: InvestegationEmployeeModel[]
  public nextMeetingDate: string
  public nextMeetingTime: string
  public lastMeetingDate: string
  public lastMeetingTime: string
  public investigationMeetings: MeetingModel[]

  constructor(
    id: number,
    title: string,
    serialNumber: string,
    date: string,
    observation: HazardModel,
    status: number,
    type: number,
    investigationTeamLeader: TitleInterface,
    investigationEmployees: InvestegationEmployeeModel[],
    lastMeetingDate: string,
    lastMeetingTime: string,
    nextMeetingDate: string,
    nextMeetingTime: string,
    investigationMeetings: MeetingModel[],
  ) {
    this.id = id
    this.title = title
    this.serialNumber = serialNumber
    this.date = date
    this.observation = observation
    this.status = status
    this.type = type
    this.investigationTeamLeader = investigationTeamLeader
    this.investigationEmployees = investigationEmployees
    this.lastMeetingDate = lastMeetingDate
    this.lastMeetingTime = lastMeetingTime
    this.nextMeetingDate = nextMeetingDate
    this.nextMeetingTime = nextMeetingTime
    this.investigationMeetings = investigationMeetings
  }

  static fromMap(data: any): InvestegationResultDetailsModel {
    return new InvestegationResultDetailsModel(
      data.id || data?.investigation_id,
      data.title,
      data.serial_number,
      data.date,
      data.observation,
      data.status,
      data.type,
      data.investigation_team_leader,
      data.investigation_employees?.map((i: any) => InvestegationEmployeeModel.fromMap(i)) ?? [],
      data.next_meeting_date,
      data.next_meeting_time,
      data.last_meeting_date,
      data.last_meeting_time,
      data.investigation_meetings.map((i: any) => MeetingModel.fromMap(i)),
    )
  }
  static example: InvestegationResultDetailsModel = new InvestegationResultDetailsModel(
    3,
    'Title',
    '_0b5512547_5432',
    '2025-03-15 09:45 AM',
    HazardModel.example,
    1,
    2,
    new TitleInterface({ id: 1, title: 'Mohab Mohamed' }),
    [
      InvestegationEmployeeModel.example,
      InvestegationEmployeeModel.example,
      InvestegationEmployeeModel.example,
    ],
  )
}
