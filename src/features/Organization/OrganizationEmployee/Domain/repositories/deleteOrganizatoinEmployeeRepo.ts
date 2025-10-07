import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { DeleteOrganizationApiService } from '@/features/setting/organization/Data/apiServices/deleteOrganizationApiService';
import OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel';

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
    return DeleteOrganizationApiService.getInstance()
  }
}

export { DeleteOrganizationEmployeeRepo }
