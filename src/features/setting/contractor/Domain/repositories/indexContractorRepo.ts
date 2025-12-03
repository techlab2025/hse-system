// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexContractorApiService } from '../../Data/apiServices/indexContractorApiService'
import ContractorModel from '../../Data/models/ContractorModel'

class IndexContractorRepo extends RepoInterface<ContractorModel[]> {
  private static instance: IndexContractorRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexContractorRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ContractorModel[] {
    return data.map((item: any) => ContractorModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexContractorApiService.getInstance()
  }
}

export { IndexContractorRepo }
