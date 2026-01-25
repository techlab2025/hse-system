// import LangModel from '@/features/setting/EmployeeType/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import EmployeeModel from '../../Data/models/equipmentModel'
import { AddEmployeeApiService } from '../../Data/apiServices/addEmployeeApiService'

class AddEmployeeRepo extends RepoInterface<EmployeeModel> {
  private static instance: AddEmployeeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddEmployeeRepo()
    }
    return this.instance
  }

  onParse(data: any): EmployeeModel {
    return EmployeeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddEmployeeApiService.getInstance()
  }
}

export { AddEmployeeRepo }
