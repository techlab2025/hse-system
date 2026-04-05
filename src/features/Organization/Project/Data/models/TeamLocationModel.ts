import ProjectLocationTeamModel from './CustomLocation/ProjectLocationTeamModel'
import TitleInterface from '@/base/Data/Models/title_interface'

export default class TeamLocation {
  public projectLocationId: number
  public locationId: number
  public location_title: string
  public projectLocationTeams: ProjectLocationTeamModel[]
  public hierarchy: TitleInterface | undefined | null

  constructor(
    projectLocationId: number,
    locationId: number,
    location_title: string,
    projectLocationTeams: ProjectLocationTeamModel[],
    hierarchy: TitleInterface | undefined | null,
  ) {
    this.projectLocationId = projectLocationId
    this.locationId = locationId
    this.location_title = location_title
    this.projectLocationTeams = projectLocationTeams
    this.hierarchy = hierarchy
  }

  static fromMap(data: any): TeamLocation {
    return new TeamLocation(
      data.project_location_id,
      data.location_id,
      data.location_title,
      data.project_location_teams?.map((item: any) => ProjectLocationTeamModel.fromMap(item)),
      data.hierarchy,
    )
  }

  static example: TeamLocation = new TeamLocation(
    1,
    1,
    'Project Location',
    [ProjectLocationTeamModel.example],
    new TitleInterface({ id: 1, title: 'asd' }),
  )
}
