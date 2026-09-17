// import LangModel from '@/features/setting/Project/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchPermitsApiService } from '../../../Data/apiServices/PermitToWork/FetchPermitsApiService'
import ProjectPermitsModel from '../../../Data/models/PermitToWork/ProjectPermitsModel'

class FetchPermitsRepo extends RepoInterface<ProjectPermitsModel[]> {
  private static instance: FetchPermitsRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchPermitsRepo()
    }
    return this.instance
  }

  // override get responseType(): ResponseType {
  //   return ResponseType.withoutData
  // }

  onParse(data: any): ProjectPermitsModel[] {
    return data.map((el) => ProjectPermitsModel.fromMap(el))
  }

  get serviceInstance(): ServicesInterface {
    return FetchPermitsApiService.getInstance()
  }
}

export { FetchPermitsRepo }
