import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexAuditActivityApiService } from '../../Data/apiServices/indexAuditActivityApiService'
import AuditActivityModel from '../../Data/models/AuditActivityModel'

class IndexAuditActivityRepo extends RepoInterface<AuditActivityModel[]> {
  private static instance: IndexAuditActivityRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAuditActivityRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): AuditActivityModel[] {
    return data.map((item: any) => AuditActivityModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexAuditActivityApiService.getInstance()
  }
}

export { IndexAuditActivityRepo }
