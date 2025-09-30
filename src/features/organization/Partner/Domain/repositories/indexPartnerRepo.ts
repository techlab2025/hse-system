// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PartnerModel from '../../Data/models/PartnerModel'
import { IndexPartnerApiService } from '../../Data/apiServices/indexPartnerApiService'

class IndexPartnerRepo extends RepoInterface<PartnerModel[]> {
  private static instance: IndexPartnerRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPartnerRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): PartnerModel[] {
    return data.map((item: any) => PartnerModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexPartnerApiService.getInstance()
  }
}

export { IndexPartnerRepo }
