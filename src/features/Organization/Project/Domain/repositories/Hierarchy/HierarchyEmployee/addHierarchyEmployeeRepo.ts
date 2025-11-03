// import LangModel from '@/features/setting/HierarchyEmployee/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HierarchyEmployeeModel from '@/features/Organization/Project/Data/models/LocationHierarchyEmployeeModel'
import { AddHierarchyEmployeeApiService } from '@/features/Organization/Project/Data/apiServices/Hierarchy/HierarchyEmployee/addHierarchyEmployeeApiService'


class AddHierarchyEmployeeRepo extends RepoInterface<HierarchyEmployeeModel> {
  private static instance: AddHierarchyEmployeeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddHierarchyEmployeeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): HierarchyEmployeeModel {
    return HierarchyEmployeeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddHierarchyEmployeeApiService.getInstance()
  }
}

export { AddHierarchyEmployeeRepo }
