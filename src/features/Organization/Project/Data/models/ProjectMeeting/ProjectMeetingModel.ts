import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import ProjectMeetingHierarchyModel from './ProjectMeetingHierarchyModel'

export default class ProjectMeetingModel {
  public id: number
  public date: string
  public hierarchies: ProjectMeetingHierarchyModel[]
  public teamLeader: OrganizatoinEmployeeModel
  public serialName: string
  public hasResult: boolean

  constructor(data: {
    id: number
    date: string
    hierarchies: ProjectMeetingHierarchyModel[]
    teamLeader: OrganizatoinEmployeeModel
    serialName: string
    hasResult: boolean
  }) {
    this.id = data.id
    this.date = data.date
    this.hierarchies = data.hierarchies
    this.teamLeader = data.teamLeader
    this.serialName = data.serialName
    this.hasResult = data.hasResult
  }

  static fromMap(data: any): ProjectMeetingModel {
    return new ProjectMeetingModel({
      id: data.id,
      date: data.date,
      hierarchies:
        data.hierarchies && Array.isArray(data.hierarchies)
          ? data.hierarchies.map((el) => ProjectMeetingHierarchyModel.fromMap(el))
          : [],
      serialName: data.serial_name,
      teamLeader: data.team_leader ? OrganizatoinEmployeeModel.fromMap(data.team_leader) : {},
      hasResult: data?.has_result ? data?.has_result : false,
    })
  }

  static example: ProjectMeetingModel = new ProjectMeetingModel({
    id: 11,
    date: '1-9-2001',
    hierarchies: [ProjectMeetingHierarchyModel.example],
    serialName: '#Meting-10',
    teamLeader: OrganizatoinEmployeeModel.exampl2,
    hasResult: true,
  })
}

// {
//     "id": 1,
//     "meeting_id": 1,
//     "organization_id": 17,
//     "meeting_group_id": 8,
//     "date": "2026-09-16",
//     "time": null,
//     "content": null,
//     "serial_name": "0",
//     "hierarchies": [],
//     "created_at": "2026-09-16 12:22:07",
//     "team_leader": null
// }
