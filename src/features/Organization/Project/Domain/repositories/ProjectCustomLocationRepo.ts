import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ProjectCustomLocationApiService } from '../../Data/apiServices/ProjectCutomLocationApiService'
import ProjectCustomLocationModel from '../../Data/models/CustomLocation/ProjectCustomLocationModel'

// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ProjectCustomLocationRepo extends RepoInterface<ProjectCustomLocationModel[]> {
  private static instance: ProjectCustomLocationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectCustomLocationRepo()
    }
    return this.instance
  }

  onParse(data: any): ProjectCustomLocationModel[] {
    return data.map((item: any) => ProjectCustomLocationModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return ProjectCustomLocationApiService.getInstance()
  }
}

export { ProjectCustomLocationRepo }
