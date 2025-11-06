// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchProjectLocationEmployeeApiService } from '../../Data/apiServices/FetchProjectLocationEmployee'
import ProjectLocationEmployeesModel from '../../Data/models/ProjectLocationEmployee'

class FetchProjectLocationEmployeeRepo extends RepoInterface<ProjectLocationEmployeesModel[]> {
  private static instance: FetchProjectLocationEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectLocationEmployeeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ProjectLocationEmployeesModel[] {
    return data.map((item: any) => ProjectLocationEmployeesModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchProjectLocationEmployeeApiService.getInstance()
  }
}

export { FetchProjectLocationEmployeeRepo }
