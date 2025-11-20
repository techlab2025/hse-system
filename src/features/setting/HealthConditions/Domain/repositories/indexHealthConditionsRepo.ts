// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import { IndexHealthConditionsApiService } from '@/features/setting/HealthConditions/Data/apiServices/indexHealthConditionsApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'

class IndexHealthConditionsRepo extends RepoInterface<HealthConditionsModel[]> {
  private static instance: IndexHealthConditionsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHealthConditionsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HealthConditionsModel[] {
    return data.map((item: any) => HealthConditionsModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHealthConditionsApiService.getInstance()
  }
}

export { IndexHealthConditionsRepo }
