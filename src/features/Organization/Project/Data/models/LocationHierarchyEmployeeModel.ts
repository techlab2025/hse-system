import TitleModel from '@/base/core/Models/title_model'
import ProjectLocationHierarchyModel from './CustomLocation/ProjectLocationHierarchyModel'

export default class HierarchyEmployeeModel extends TitleModel {
  public projectLocationId: number
  public projectLocationHierarchies: ProjectLocationHierarchyModel[]

  constructor(
    id: number,
    title: string,
    projectLocationId: number,
    projectLocationHierarchies: ProjectLocationHierarchyModel[],
  ) {
    super(title, id)
    this.projectLocationId = projectLocationId
    this.projectLocationHierarchies = projectLocationHierarchies
  }

  static fromMap(data: any): HierarchyEmployeeModel {
    return new HierarchyEmployeeModel(
      data.project_location_hierarchy_employee_id,
      data.name,
      data.employee_id,
      data.project_location_hierarchies?.map((item: any) =>
        ProjectLocationHierarchyModel.fromMap(item),
      ),
    )
  }
}
