import ProjectLocationTeamModel from './CustomLocation/ProjectLocationTeamModel'

export default class TeamLocation {
  public projectLocationId: number
  public locationId: number
  public location_title: string
  public projectLocationTeams: ProjectLocationTeamModel[]

  constructor(
    projectLocationId: number,
    locationId: number,
    location_title: string,
    projectLocationTeams: ProjectLocationTeamModel[],
  ) {
    this.projectLocationId = projectLocationId
    this.locationId = locationId
    this.location_title = location_title
    this.projectLocationTeams = projectLocationTeams
  }

  static fromMap(data: any): TeamLocation {
    return new TeamLocation(
      data.project_location_id,
      data.location_id,
      data.location_title,
      data.project_location_teams?.map((item: any) => ProjectLocationTeamModel.fromMap(item)),
    )
  }
}
