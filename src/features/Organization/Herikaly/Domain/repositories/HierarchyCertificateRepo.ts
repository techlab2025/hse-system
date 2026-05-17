// import LangModel from '@/features/setting/Herikaly/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HierarchyCertificateModel from '../../Data/models/HeirarchyCertificateModel'
import { FetchHirarchyCertificatesApiService } from '../../Data/apiServices/FetchHierarchyCertificatesApiService'

class HierarchyCertificateRepo extends RepoInterface<HierarchyCertificateModel[]> {
  private static instance: HierarchyCertificateRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new HierarchyCertificateRepo()
    }
    return this.instance
  }


  onParse(data: any): HierarchyCertificateModel[] {
    return data.map((el: any) => HierarchyCertificateModel.fromMap(el))
  }

  get serviceInstance(): ServicesInterface {
    return FetchHirarchyCertificatesApiService.getInstance()
  }
}

export { HierarchyCertificateRepo }
