import TitleInterface from '@/base/Data/Models/title_interface'
import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class projectLocationModel {
  public employees: OrganizatoinEmployeeDetailsModel[]
  public locationId: number
  public locationTitle: string
  public projectId: number
  public projectLocationId: number
  public hierarchy: TitleInterface | undefined | null

  constructor(
    employees: OrganizatoinEmployeeDetailsModel[],
    locationId: number,
    locationTitle: string,
    projectId: number,
    projectLocationId: number,
    hierarchy: TitleInterface | undefined | null,

  ) {
    this.employees = employees
    this.locationId = locationId
    this.locationTitle = locationTitle
    this.projectId = projectId
    this.projectLocationId = projectLocationId
    this.hierarchy = hierarchy
  }

  static fromMap(data: any): projectLocationModel {
    return new projectLocationModel(
      data.employees.map((item: any) => OrganizatoinEmployeeDetailsModel.fromMap(item)),
      data.location_id,
      data.location_title,
      data.project_id,
      data.project_location_id,
      data.hierarchy,
    )
  }
  static example = new projectLocationModel(
    [
      {
        ...OrganizatoinEmployeeDetailsModel.example,
        name: 'Mohab',
        image:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
      {
        ...OrganizatoinEmployeeDetailsModel.example,
        name: 'Mohamed',
        image:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
      {
        ...OrganizatoinEmployeeDetailsModel.example,
        name: 'Ahmed',
        image:
          'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png',
      },
    ],
    1,
    'Main Office',
    1,
    1,
    new TitleInterface({ id: 1, title: 'asd' }),
  )
}
