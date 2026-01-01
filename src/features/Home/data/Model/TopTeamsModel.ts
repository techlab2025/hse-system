
export default class TopTeamsModel {
  public id: number
  public title: string
  public number: number

  constructor(id: number, title: string, number: number) {
    this.id = id
    this.title = title
    this.number = number
  }

  static fromMap(data: any): TopTeamsModel {
    return new TopTeamsModel(
      data.id,
      data.title,
      data.number
    )
  }
  static example: TopTeamsModel = new TopTeamsModel(
    1,
    "Team A",
    200
  )
}
