// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditContractorApiService } from '../../Data/apiServices/editContractorApiService'
import ContractorModel from '../../Data/models/ContractorModel'

class EditContractorRepo extends RepoInterface<ContractorModel> {
  private static instance: EditContractorRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditContractorRepo()
    }
    return this.instance
  }

  onParse(data: any): ContractorModel {
    return ContractorModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditContractorApiService.getInstance()
  }
}

export { EditContractorRepo }
