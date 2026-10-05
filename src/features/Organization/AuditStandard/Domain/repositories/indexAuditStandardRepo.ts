import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexAuditStandardApiService } from '../../Data/apiServices/indexAuditStandardApiService'
import AuditStandardModel from '../../Data/models/AuditStandardModel'

class IndexAuditStandardRepo extends RepoInterface<AuditStandardModel[]> {
  private static instance: IndexAuditStandardRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAuditStandardRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): AuditStandardModel[] {
    return data.map((item: any) => AuditStandardModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexAuditStandardApiService.getInstance()
  }
}

export { IndexAuditStandardRepo }
