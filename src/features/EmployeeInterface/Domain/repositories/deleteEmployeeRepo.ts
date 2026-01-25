// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import EmployeeModel from '../../Data/models/equipmentModel'
import { DeleteEmployeeApiService } from '../../Data/apiServices/deleteEmployeeApiService'

class DeleteEmployeeRepo extends RepoInterface<EmployeeModel> {
  private static instance: DeleteEmployeeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEmployeeRepo()
    }
    return this.instance
  }

  onParse(data: any): EmployeeModel {
    return EmployeeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteEmployeeApiService.getInstance()
  }
}

export { DeleteEmployeeRepo }
