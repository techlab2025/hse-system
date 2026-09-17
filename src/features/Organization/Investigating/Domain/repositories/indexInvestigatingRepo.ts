import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InvestigatingModel from '../../Data/models/investigatingModel'
import { IndexInvestigatingApiService } from '../../Data/apiServices/indexInvestigatingApiService'

class IndexInvestigatingRepo extends RepoInterface<InvestigatingModel[]> {
  private static instance: IndexInvestigatingRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInvestigatingRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): InvestigatingModel[] {
    return data.map((item: any) => InvestigatingModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexInvestigatingApiService.getInstance()
  }
}

export { IndexInvestigatingRepo }
