// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import SubscriptionApplicationModel from '../../Data/models/SubscriptionApplicationModel'
import { IndexSubscriptionApiService } from '../../Data/apiServices/indexSubscriptionApplicationApiService'

class IndexSubscriptionApplicationRepo extends RepoInterface<SubscriptionApplicationModel[]> {
  private static instance: IndexSubscriptionApplicationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSubscriptionApplicationRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): SubscriptionApplicationModel[] {
    return data.map((item: any) => SubscriptionApplicationModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSubscriptionApiService.getInstance()
  }
}

export { IndexSubscriptionApplicationRepo }
