import TitleModel from '@/base/core/Models/title_model'
import ProjectLocationEmployeeModel from './ProjectLocationEmployeeModel'

export default class ProjectLocationHierarchyModel extends TitleModel {
  public Employees: TitleModel[]
  public projectLocationHierarchyId: number

  constructor(
    title: string,
    id: number,
    projectLocationHierarchyId: number,
    Employees: TitleModel[],
  ) {
    super(title, id)
    this.projectLocationHierarchyId = projectLocationHierarchyId
    this.Employees = Employees
  }

  static fromMap(data: any): ProjectLocationHierarchyModel {
    return new ProjectLocationHierarchyModel(
      data.title,
      data.hierarchy_id,
      data.project_location_hierarchy_id,
      data.project_location_hierarchy_employees?.map((item) =>
        ProjectLocationEmployeeModel.fromMap(item),
      ),
      // data.project_location_id,
    )
  }
}
