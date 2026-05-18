// import LangModel from '@/features/setting/Herikaly/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HerikalyModel from '../../Data/models/HerikalyModel'
import { addcertificateToHieararcyApiService } from '../../Data/apiServices/addcertificateToHieararcyApiService'

class AddCertificateToHierarchyRepo extends RepoInterface<HerikalyModel> {
  private static instance: AddCertificateToHierarchyRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddCertificateToHierarchyRepo()
    }
    return this.instance
  }

  onParse(data: any): HerikalyModel {
    return HerikalyModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return addcertificateToHieararcyApiService.getInstance()
  }
}

export { AddCertificateToHierarchyRepo }
