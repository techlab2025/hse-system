import TitleModel from '@/base/core/Models/title_model'

export default class ProjectLocationTeamModel extends TitleModel {
  public Employees: TitleModel[]

  constructor(id: number, title: string , Employees: TitleModel[]) {
    super(title, id)
    this.Employees = Employees
  }

  static fromMap(data: any): ProjectLocationTeamModel {
    return new ProjectLocationTeamModel(data.id, data.title , data.Employees)
  }
}
