import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import { ShowContractorApiService } from '../../Data/apiServices/showContractorApiService'
import ContractorDetailsModel from '../../Data/models/ContractorDetailsModel'

class ShowContractorRepo extends RepoInterface<ContractorDetailsModel> {
  private static instance: ShowContractorRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowContractorRepo()
    }
    return this.instance
  }

  onParse(data: any): ContractorDetailsModel {
    return ContractorDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowContractorApiService.getInstance()
  }
}

export { ShowContractorRepo }
