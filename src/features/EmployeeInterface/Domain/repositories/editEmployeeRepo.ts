// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import EmployeeModel from '../../Data/models/equipmentModel'
import { EditEmployeeApiService } from '../../Data/apiServices/editEmployeeApiService'

class EditEmployeeRepo extends RepoInterface<EmployeeModel> {
  private static instance: EditEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditEmployeeRepo()
    }
    return this.instance
  }

  onParse(data: any): EmployeeModel {
    return EmployeeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditEmployeeApiService.getInstance()
  }
}

export { EditEmployeeRepo }
