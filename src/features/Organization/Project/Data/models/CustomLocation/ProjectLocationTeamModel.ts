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
    const projectTeamId =
      data.project_location_team_id ?? data.project_team_id ?? data.location_id ?? 0
    return new ProjectLocationTeamModel(
      projectTeamId,
      data.team_title || data.title || data.location_title,
      (data.project_location_team_employees || data.project_location_employees)?.map((item) =>
        ProjectLocationEmployeeModel.fromMap(item),
      ) ?? [],
      projectTeamId,
      data.team_id,
      data.team_title || data.title,
    )
  }

  static example: ProjectLocationTeamModel = new ProjectLocationTeamModel(
    1,
    'Team 1',
    [ProjectLocationEmployeeModel.example],
    1,
    20,
    'Team',
  )
}
