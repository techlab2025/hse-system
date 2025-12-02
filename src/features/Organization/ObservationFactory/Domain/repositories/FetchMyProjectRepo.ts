import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditHazardApiService } from '../../Data/apiServices/editHazardApiService'
import HazardModel from '../../Data/models/hazardModel'
import { FetchMyProjectApiService } from '../../Data/apiServices/fecthMyProjectApiService'
import ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'

class FetchMyProjectsRepo extends RepoInterface<ProjectModel[]> {
  private static instance: FetchMyProjectsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
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
