// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexObjectivesApiService } from '../../Data/apiServices/indexObjectivesApiService'
import ObjectivesModel from '../../Data/models/objectivesModel'

class IndexObjectivesRepo extends RepoInterface<ObjectivesModel[]> {
  private static instance: IndexObjectivesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexObjectivesRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ObjectivesModel[] {
    return data.map((item: any) => ObjectivesModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexObjectivesApiService.getInstance()
  }
}

export { IndexObjectivesRepo }
