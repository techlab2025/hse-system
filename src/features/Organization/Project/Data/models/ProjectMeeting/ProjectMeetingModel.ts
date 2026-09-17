import OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'
import ProjectMeetingHierarchyModel from './ProjectMeetingHierarchyModel'

export default class ProjectMeetingModel {
  public id: number
  public date: string
  public hierarchies: ProjectMeetingHierarchyModel[]
  public teamLeader: OrganizatoinEmployeeModel
  public serialName: string

  constructor(data: {
    id: number
    date: string
    hierarchies: ProjectMeetingHierarchyModel[]
    teamLeader: OrganizatoinEmployeeModel
    serialName: string
  }) {
    this.id = data.id
    this.date = data.date
    this.hierarchies = data.hierarchies
    this.teamLeader = data.teamLeader
    this.serialName = data.serialName
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
    })
  }

  static example: ProjectMeetingModel = new ProjectMeetingModel({
    id: 11,
    date: '1-9-2001',
    hierarchies: [ProjectMeetingHierarchyModel.example],
    serialName: '#Meting-10',
    teamLeader: OrganizatoinEmployeeModel.exampl2,
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
