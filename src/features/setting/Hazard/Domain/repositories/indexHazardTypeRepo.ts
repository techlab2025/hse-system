// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import { IndexHazardTypeApiService } from '@/features/setting/HazardType/Data/apiServices/indexHazardTypeApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'

class IndexHazardTypeRepo extends RepoInterface<HazardTypeModel[]> {
  private static instance: IndexHazardTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHazardTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HazardTypeModel[] {
    return data.map((item: any) => HazardTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHazardTypeApiService.getInstance()
  }
}

export { IndexHazardTypeRepo }
