import type TitleInterface from '@/base/Data/Models/title_interface'

export default class TeamLocation {
  public projectLocationId: number
  public locationId: number
  public location_title: string
  public projectLocationTeams: TitleInterface[]

  constructor(
    projectLocationId: number,
    locationId: number,
    location_title: string,
    projectLocationTeams: TitleInterface[],
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
      data.project_location_teams,
    )
  }
}
