// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskManagementModel from '../../Data/models/SystemRiskManagementModel'
import { IndexSystemRiskManagementApiService } from '../../Data/apiServices/indexSystemRiskManagementApiService'




class IndexSystemRiskManagementRepo extends RepoInterface<SystemRiskManagementModel[]> {
  private static instance: IndexSystemRiskManagementRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemRiskManagementRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SystemRiskManagementModel[] {
    return data.map((item: any) => SystemRiskManagementModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSystemRiskManagementApiService.getInstance()
  }
}

export { IndexSystemRiskManagementRepo }
