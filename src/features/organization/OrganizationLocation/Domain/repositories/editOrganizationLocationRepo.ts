// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import { EditOrganizationLocationApiService } from '../../Data/apiServices/editOrganizationLocationApiService'


class EditOrganizationLocationRepo extends RepoInterface<OrganizationLocationModel> {
  private static instance: EditOrganizationLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditOrganizationLocationRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): OrganizationLocationModel {
    return OrganizationLocationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditOrganizationLocationApiService.getInstance()
  }
}

export { EditOrganizationLocationRepo }
