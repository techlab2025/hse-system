// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import { IndexProjectTypeApiService } from '@/features/setting/ProjectType/Data/apiServices/indexProjectTypeApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel'

class IndexProjectTypeRepo extends RepoInterface<ProjectTypeModel[]> {
  private static instance: IndexProjectTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexProjectTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ProjectTypeModel[] {
    return data.map((item: any) => ProjectTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexProjectTypeApiService.getInstance()
  }
}

export { IndexProjectTypeRepo }
