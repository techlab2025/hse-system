// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import EmployeeModel from '../../Data/models/equipmentModel'
import { DisEmployeeApiService } from '../../Data/apiServices/disEmployeeApiService'

class DisActiveEmployeeRepo extends RepoInterface<EmployeeModel> {
  private static instance: DisActiveEmployeeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveEmployeeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): EmployeeModel {
    return EmployeeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisEmployeeApiService.getInstance()
  }
}

export { DisActiveEmployeeRepo }
