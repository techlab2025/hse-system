// import ClientModel from '@/features/setting/languages/Data/models/equipmentTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObjectivesModel from '../../Data/models/objectivesModel'
import { DeleteObjectivesApiService } from '../../Data/apiServices/deleteObjectivesApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteObjectivesRepo extends RepoInterface<ObjectivesModel> {
  private static instance: DeleteObjectivesRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteObjectivesRepo()
    }
    return this.instance
  }

  onParse(data: any): ObjectivesModel {
    return ObjectivesModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteObjectivesApiService.getInstance()
  }
}

export { DeleteObjectivesRepo }
