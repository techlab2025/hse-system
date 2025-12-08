// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexRoleApiService } from '../../Data/apiServices/indexRoleApiService'
import RoleModel from '../../Data/models/RoleModel'

class IndexRoleRepo extends RepoInterface<RoleModel[]> {
  private static instance: IndexRoleRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexRoleRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): RoleModel[] {
    return data.map((item: any) => RoleModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexRoleApiService.getInstance()
  }
}

export { IndexRoleRepo }
