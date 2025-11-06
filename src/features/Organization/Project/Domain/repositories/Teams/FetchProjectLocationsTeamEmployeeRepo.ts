// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchProjectLocationsTeamEmployeeApiService } from '../../../Data/apiServices/Teams/FetchProjectLocationsTeamEmployee'
import LocationTeamEmployeesModel from '../../../Data/models/Teams/ProjectLocationTeamEmployee'

class FetchProjectLocationsTeamEmployeeRepo extends RepoInterface<LocationTeamEmployeesModel[]> {
  private static instance: FetchProjectLocationsTeamEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectLocationsTeamEmployeeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): LocationTeamEmployeesModel[] {
    return data.map((item: any) => LocationTeamEmployeesModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchProjectLocationsTeamEmployeeApiService.getInstance()
  }
}

export { FetchProjectLocationsTeamEmployeeRepo }
