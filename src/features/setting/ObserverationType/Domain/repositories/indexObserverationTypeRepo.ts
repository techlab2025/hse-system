// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import { IndexObserverationTypeApiService } from '@/features/setting/ObserverationType/Data/apiServices/indexObserverationTypeApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'

class IndexObserverationTypeRepo extends RepoInterface<ObserverationTypeModel[]> {
  private static instance: IndexObserverationTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexObserverationTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ObserverationTypeModel[] {
    return data.map((item: any) => ObserverationTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexObserverationTypeApiService.getInstance()
  }
}

export { IndexObserverationTypeRepo }
