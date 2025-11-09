// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import { DeleteContractorApiService } from '../../Data/apiServices/deleteContractorApiService'
import ContractorModel from '../../Data/models/ContractorModel'

class DeleteContractorRepo extends RepoInterface<ContractorModel> {
  private static instance: DeleteContractorRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteContractorRepo()
    }
    return this.instance
  }

  onParse(data: any): ContractorModel {
    return ContractorModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteContractorApiService.getInstance()
  }
}

export { DeleteContractorRepo }
