
export default class TeamLeaderModel {
  public id: number
  public Name: string

  constructor(id: number, Name: string) {
    this.id = id
    this.Name = Name
  }

  static fromMap(data: any): TeamLeaderModel {
    return new TeamLeaderModel(data.id, data.name)
  }

  static example: TeamLeaderModel = new TeamLeaderModel(1, 'Mohab')
}
