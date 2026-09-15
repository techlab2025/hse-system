import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PpeItemModel from '../../Data/models/MangementChangeTopicTypeModel'
import { DeleteMangementChangeTopicTypeApiService } from '../../Data/apiServices/deleteMangementChangeTopicTypeApiService'

class DeleteMangementChangeTopicTypeRepo extends RepoInterface<PpeItemModel> {
  private static instance: DeleteMangementChangeTopicTypeRepo

   
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteMangementChangeTopicTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): PpeItemModel {
    return PpeItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteMangementChangeTopicTypeApiService.getInstance()
  }
}

export { DeleteMangementChangeTopicTypeRepo }
