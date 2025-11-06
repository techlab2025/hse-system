import TitleModel from '@/base/core/Models/title_model'

export default class ProjectLocationHierarchyModel extends TitleModel {
  public Employees: TitleModel[]

  constructor(id: number, title: string, Employees: TitleModel[]) {
    super(title, id)
    this.Employees = Employees
  }

  static fromMap(data: any): ProjectLocationHierarchyModel {
    return new ProjectLocationHierarchyModel(data.id, data.title, data.Employees)
  }
}
