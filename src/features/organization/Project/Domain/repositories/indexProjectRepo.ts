// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectModel from '../../Data/models/ProjectModel'
import { IndexProjectApiService } from '../../Data/apiServices/indexProjectApiService'

class IndexProjectRepo extends RepoInterface<ProjectModel[]> {
  private static instance: IndexProjectRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ProjectModel[] {
    return data.map((item: any) => ProjectModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexProjectApiService.getInstance()
  }
}

export { IndexProjectRepo }
