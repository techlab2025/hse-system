import type Params from '@/base/core/params/params'
import type CreateProjectMeetingHierarchyIdParams from './ProjectMeetingHierarchyIdsParams'
import type ProjectMeetingDatesParams from './ProjectMeetingDatesParams'

export default class CreateProjectMeetingParams implements Params {
  public projectId: number
  public MeetingTypeId: number
  public title: string
  public dates: ProjectMeetingDatesParams[]
  public hierarchies: CreateProjectMeetingHierarchyIdParams[]
  public TeamLeadrId: number
  public employees: { employee_id: number }[]

  constructor(data: {
    projectId: number
    MeetingTypeId: number
    title: string
    dates: ProjectMeetingDatesParams[]
    hierarchies: CreateProjectMeetingHierarchyIdParams[]
    TeamLeadrId: number
    employees: { employee_id: number }[]
  }) {
    this.projectId = data.projectId
    this.MeetingTypeId = data.MeetingTypeId
    this.title = data.title
    this.dates = data.dates
    this.hierarchies = data.hierarchies
    this.TeamLeadrId = data.TeamLeadrId
    this.employees = data.employees
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
    data['meeting_type_id'] = this.MeetingTypeId
    data['title'] = this.title
    if (this.dates.length > 0) data['periods'] = this.dates.map((el) => el.toMap())
    if(this.hierarchies.length > 0)data['hierarchies'] = this.hierarchies.map((el) => el.toMap())
    data['team_leader_id'] = this.TeamLeadrId
    data['employees'] = this.employees

    return data
  }
}
