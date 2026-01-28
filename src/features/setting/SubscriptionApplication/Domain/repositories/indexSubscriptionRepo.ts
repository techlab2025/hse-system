// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexSubscriptionApiService } from '../../Data/apiServices/indexSubscriptionApplicationApiService'
import SubscriptionModel from '../../Data/models/SubscriptionModel'

class IndexSubscriptionRepo extends RepoInterface<SubscriptionModel[]> {
  private static instance: IndexSubscriptionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSubscriptionRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SubscriptionModel[] {
    return data.map((item: any) => SubscriptionModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSubscriptionApiService.getInstance()
  }
}

export { IndexSubscriptionRepo }
