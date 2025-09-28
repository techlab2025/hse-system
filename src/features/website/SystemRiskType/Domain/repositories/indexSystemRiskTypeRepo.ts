// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import { IndexSystemRiskTypeApiService } from '../../Data/apiServices/indexSystemRiskTypeApiService'
class IndexSystemRiskTypeRepo extends RepoInterface<SystemRiskTypeModel[]> {
  private static instance: IndexSystemRiskTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemRiskTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SystemRiskTypeModel[] {
    return data.map((item: any) => SystemRiskTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSystemRiskTypeApiService.getInstance()
  }
}

export { IndexSystemRiskTypeRepo }
