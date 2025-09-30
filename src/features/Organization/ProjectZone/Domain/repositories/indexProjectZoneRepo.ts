// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import { IndexProjectZoneApiService } from '../../Data/apiServices/indexProjectZoneApiService'




class IndexProjectZoneRepo extends RepoInterface<ProjectZoneModel[]> {
  private static instance: IndexProjectZoneRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectZoneRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ProjectZoneModel[] {
    return data.map((item: any) => ProjectZoneModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexProjectZoneApiService.getInstance()
  }
}

export { IndexProjectZoneRepo }
