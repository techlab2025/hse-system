// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexProjectLocationZonesApiService } from '../../Data/apiServices/fetchProjectLocationsZonesApiService'
import ProjectLocationZonesModel from '../../Data/models/ProjectLocationZones'

class IndexProjectLocationZonesRepo extends RepoInterface<ProjectLocationZonesModel[]> {
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

  onParse(data: any): ProjectLocationZonesModel[] {
    return data.map((item: any) => ProjectLocationZonesModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexProjectLocationZonesApiService.getInstance()
  }
}

export { IndexProjectLocationZonesRepo }
