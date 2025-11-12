// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexProjectLocationZonesApiService } from '../../Data/apiServices/fetchProjectLocationsZonesApiService'
// import ProjectLocationZonesModel from '../../Data/models/ProjectLocationZones'
import SohwProjectZoonModel from '../../Data/models/ShowProjectZone'

class IndexProjectLocationZonesRepo extends RepoInterface<SohwProjectZoonModel[]> {
  private static instance: IndexProjectLocationZonesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectLocationZonesRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SohwProjectZoonModel[] {
    return data.map((item: any) => SohwProjectZoonModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexProjectLocationZonesApiService.getInstance()
  }
}

export { IndexProjectLocationZonesRepo }
