// import LangModel from '@/features/setting/ContractorType/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddContractorApiService } from '../../Data/apiServices/addContractorApiService'
import ContractorModel from '../../Data/models/ContractorModel'

class AddContractorRepo extends RepoInterface<ContractorModel> {
  private static instance: AddContractorRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddContractorRepo()
    }
    return this.instance
  }

  onParse(data: any): ContractorModel {
    return ContractorModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddContractorApiService.getInstance()
  }
}

export { AddContractorRepo }
