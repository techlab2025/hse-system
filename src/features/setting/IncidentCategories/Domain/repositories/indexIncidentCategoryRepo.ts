// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import { IndexIncidentCategoryApiService } from '../../Data/apiServices/indexIncidentCategoryApiService'

class IndexIncidentCategoryRepo extends RepoInterface<IncidentCategoryModel[]> {
  private static instance: IndexIncidentCategoryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexIncidentCategoryRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): IncidentCategoryModel[] {
    return data.map((item: any) => IncidentCategoryModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexIncidentCategoryApiService.getInstance()
  }
}

export { IndexIncidentCategoryRepo }
