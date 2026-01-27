// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexSubscriptionTypeApiService } from '../../Data/apiServices/indexSubscriptionTypeApiService'
import SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

class IndexSubscriptionTypeRepo extends RepoInterface<SubscriptionTypeModel[]> {
  private static instance: IndexSubscriptionTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSubscriptionTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SubscriptionTypeModel[] {
    return data.map((item: any) => SubscriptionTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSubscriptionTypeApiService.getInstance()
  }
}

export { IndexSubscriptionTypeRepo }
