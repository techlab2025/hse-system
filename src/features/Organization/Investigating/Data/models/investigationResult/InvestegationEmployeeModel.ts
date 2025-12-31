import TitleInterface from '@/base/Data/Models/title_interface'
import HazardModel from '@/features/Organization/ObservationFactory/Data/models/hazardModel'
import OrganizatoinEmployeeDetailsModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeDetailsModel'

export default class InvestegationEmployeeModel {
  public id: number
  public status: number
  public isLeader: number
  public organizationEmployee: OrganizatoinEmployeeDetailsModel

  constructor(
    id: number,
    status: number,
    isLeader: number,
    organizationEmployee: OrganizatoinEmployeeDetailsModel,
  ) {
    this.id = id
    this.status = status
    this.isLeader = isLeader
    this.organizationEmployee = organizationEmployee
  }

  static fromMap(data: any): InvestegationEmployeeModel {
    return new InvestegationEmployeeModel(
      data.id,
      data.status,
      data.is_leader,
      OrganizatoinEmployeeDetailsModel.fromMap(data.organizationEmployee),
    )
  }
  static example: InvestegationEmployeeModel = new InvestegationEmployeeModel(
    1,
    1,
    1,
    OrganizatoinEmployeeDetailsModel.example,
  )
}
