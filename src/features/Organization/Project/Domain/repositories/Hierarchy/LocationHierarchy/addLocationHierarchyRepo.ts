// import LangModel from '@/features/setting/Project/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ProjectModel from '@/features/Organization/Project/Data/models/ProjectModel'
import { AddLocationHierarchyApiService } from '@/features/Organization/Project/Data/apiServices/Hierarchy/LocationHierarchy/addLocationHierarchyApiService'
import LocationHierarchyModel from '@/features/Organization/Project/Data/models/LocationHierarchyModel'

class AddLocationHierarchyRepo extends RepoInterface<LocationHierarchyModel> {
  private static instance: AddLocationHierarchyRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddLocationHierarchyRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): LocationHierarchyModel {
    return LocationHierarchyModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddLocationHierarchyApiService.getInstance()
  }
}

export { AddLocationHierarchyRepo }
