// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import EmployeeModel from '../../Data/models/equipmentModel'
import { IndexEmployeeApiService } from '../../Data/apiServices/indexEmployeeApiService'

class IndexEmployeeRepo extends RepoInterface<EmployeeModel[]> {
  private static instance: IndexEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexEmployeeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): EmployeeModel[] {
    return data.map((item: any) => EmployeeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexEmployeeApiService.getInstance()
  }
}

export { IndexEmployeeRepo }
