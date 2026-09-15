
export default class ProjectMeetingModel {
  public id: number
  public title: string
  public date: string

  constructor(data: { id: number; title: string; date: string }) {
    this.id = data.id
    this.title = data.title

    this.date = data.date
  }

  static fromMap(data: any): ProjectMeetingModel {
    return new ProjectMeetingModel({
      id: data.id,
      title: data.title,
      date: data.date,
    })
  }

  static example: ProjectMeetingModel = new ProjectMeetingModel({
    id: 11,
    title: 'title',
    date: '',
  })
}
