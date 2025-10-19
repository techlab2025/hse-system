import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import EmployeeDetailsModel from '../../Data/models/equipmentDetailsModel'
import { ShowEmployeeApiService } from '../../Data/apiServices/showEmployeeApiService'

class ShowEmployeeRepo extends RepoInterface<EmployeeDetailsModel> {
  private static instance: ShowEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowEmployeeRepo()
    }
    return this.instance
  }

  onParse(data: any): EmployeeDetailsModel {
    return EmployeeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowEmployeeApiService.getInstance()
  }
}

export { ShowEmployeeRepo }
