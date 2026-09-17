import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchMyProjectApiService } from '../../Data/apiServices/fecthMyProjectApiService'
import ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'

class FetchMyProjectsRepo extends RepoInterface<ProjectModel[]> {
  private static instance: FetchMyProjectsRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchMyProjectsRepo()
    }
    return this.instance
  }


  onParse(data: any): ProjectModel[] {
    return data.map((item: any) => ProjectModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchMyProjectApiService.getInstance()
  }
}

export { FetchMyProjectsRepo }
