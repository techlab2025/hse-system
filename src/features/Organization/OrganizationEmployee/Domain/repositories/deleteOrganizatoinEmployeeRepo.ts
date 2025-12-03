import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import { DeleteOrganizationApiService } from '@/features/setting/Organization/Data/apiServices/deleteOrganizationApiService';
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel';
import { DeleteOrganizatoinEmployeeApiService } from '../../Data/apiServices/deleteOrganizatoinEmployeeApiService';

class DeleteOrganizationEmployeeRepo extends RepoInterface<OrganizatoinEmployeeModel> {
  private static instance: DeleteOrganizationEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationEmployeeRepo()
    }
    return this.instance
  }

  onParse(data: any): OrganizatoinEmployeeModel {
    return OrganizatoinEmployeeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteOrganizatoinEmployeeApiService.getInstance()
  }
}

export { DeleteOrganizationEmployeeRepo }
