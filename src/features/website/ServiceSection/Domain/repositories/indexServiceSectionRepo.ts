// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import { IndexServiceSectionApiService } from '../../Data/apiServices/indexServiceSectionApiService'

class IndexServiceSectionRepo extends RepoInterface<ServiceSectionModel[]> {
  private static instance: IndexServiceSectionRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexServiceSectionRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ServiceSectionModel[] {
    return data.map((item: any) => ServiceSectionModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexServiceSectionApiService.getInstance()
  }
}

export { IndexServiceSectionRepo }
