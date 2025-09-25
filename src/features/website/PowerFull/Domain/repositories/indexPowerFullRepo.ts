// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PowerFullModel from '../../Data/models/PowerFullModel'
import { IndexPowerFullApiService } from '../../Data/apiServices/indexPowerFullApiService'



class IndexPowerFullRepo extends RepoInterface<PowerFullModel[]> {
  private static instance: IndexPowerFullRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPowerFullRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): PowerFullModel[] {
    return data.map((item: any) => PowerFullModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexPowerFullApiService.getInstance()
  }
}

export { IndexPowerFullRepo }
