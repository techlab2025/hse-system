import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InjuryModel from '../../Data/models/InjuryModel'
import { IndexInjuryApiService } from '../../Data/apiServices/indexInjuryApiService'

class IndexInjuryRepo extends RepoInterface<InjuryModel[]> {
  private static instance: IndexInjuryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInjuryRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): InjuryModel[] {
    return data.map((item: any) => InjuryModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexInjuryApiService.getInstance()
  }
}

export { IndexInjuryRepo }
