import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import { EditOrganizatoinEmployeeApiService } from '../../Data/apiServices/editOrganizatoinEmployeeApiService'

class EditOrganizatoinEmployeeRepo extends RepoInterface<OrganizatoinEmployeeModel> {
  private static instance: EditOrganizatoinEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditOrganizatoinEmployeeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): OrganizatoinEmployeeModel {
    return OrganizatoinEmployeeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditOrganizatoinEmployeeApiService.getInstance()
  }
}

export { EditOrganizatoinEmployeeRepo }
