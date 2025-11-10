import TitleModel from '@/base/core/Models/title_model'
import ProjectLocationEmployeeModel from './ProjectLocationEmployeeModel'

export default class ProjectLocationTeamModel extends TitleModel {
  public Employees: ProjectLocationEmployeeModel[]
  public projectLocationTeamId: number
  public teamId: number

  constructor(
    id: number,
    title: string,
    Employees: ProjectLocationEmployeeModel[],
    projectLocationTeamId: number,
    teamId: number,
  ) {
    super(title, id)
    this.Employees = Employees
    this.projectLocationTeamId = projectLocationTeamId
    this.teamId = teamId
  }

  static fromMap(data: any): ProjectLocationTeamModel {
    return new ProjectLocationTeamModel(
      data.project_location_id,
      data.title,
      data.project_location_team_employees.map((item) =>
        ProjectLocationEmployeeModel.fromMap(item),
      ),
      data.project_location_team_id,
      data.team_id,
    )
  }
}
