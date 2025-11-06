// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectLocationEmployeesModel from '../../Data/models/ProjectLocationEmployee'
import { FetchProjectLocationsEmployeeApiService } from '../../Data/apiServices/FetchProjectLocationsEmployee'

class FetchProjectLocationsEmployeeRepo extends RepoInterface<ProjectLocationEmployeesModel[]> {
  private static instance: FetchProjectLocationsEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectLocationsEmployeeRepo()
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
    return FetchProjectLocationsEmployeeApiService.getInstance()
  }
}

export { FetchProjectLocationsEmployeeRepo }
