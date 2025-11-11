import TitleModel from '@/base/core/Models/title_model'
import ProjectLocationEmployeeModel from './ProjectLocationEmployeeModel'

export default class ProjectLocationTeamModel extends TitleModel {
  public Employees: ProjectLocationEmployeeModel[]
  public projectLocationTeamId: number
  public teamId: number
  public teamTitle?: string

  constructor(
    id: number,
    title: string,
    Employees: ProjectLocationEmployeeModel[],
    projectLocationTeamId: number,
    teamId: number,
    teamTitle?: string,
  ) {
    super(title, id)
    this.Employees = Employees
    this.projectLocationTeamId = projectLocationTeamId
    this.teamId = teamId
    this.teamTitle = teamTitle
  }

  static fromMap(data: any): ProjectLocationTeamModel {
    return new ProjectLocationTeamModel(
      data.project_location_id,
      data.location_title,
      (data.project_location_team_employees || data.project_location_employees)?.map((item) =>
        ProjectLocationEmployeeModel.fromMap(item),
      ),
      data.location_id,
      data.team_id,
      data.team_title,
    )
  }
}
