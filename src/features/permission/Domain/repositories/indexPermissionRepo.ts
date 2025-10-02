// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PermissionModel from '../../Data/models/PermissionModel'
import { IndexPermissionApiService } from '../../Data/apiServices/indexPermissionApiService'


class IndexPermissionRepo extends RepoInterface<PermissionModel[]> {
  private static instance: IndexPermissionRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPermissionRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): PermissionModel[] {
    return data.map((item: any) => PermissionModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexPermissionApiService.getInstance()
  }
}

export { IndexPermissionRepo }
