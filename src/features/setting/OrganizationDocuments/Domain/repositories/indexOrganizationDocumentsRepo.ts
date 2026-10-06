import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OrganizationDocumentsModel from '../../Data/models/OrganizationDocumentsModel'
import { IndexOrganizationDocumentsApiService } from '../../Data/apiServices/indexOrganizationDocumentsApiService'

class IndexOrganizationDocumentsRepo extends RepoInterface<OrganizationDocumentsModel[]> {
  private static instance: IndexOrganizationDocumentsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationDocumentsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): OrganizationDocumentsModel[] {
    return data.map((item: any) => OrganizationDocumentsModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexOrganizationDocumentsApiService.getInstance()
  }
}

export { IndexOrganizationDocumentsRepo }
