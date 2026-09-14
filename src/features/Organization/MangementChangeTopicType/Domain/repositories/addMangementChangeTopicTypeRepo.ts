// import LangModel from '@/features/setting/PpeItem/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PpeItemModel from '../../Data/models/MangementChangeTopicTypeModel'
import { AddMangementChangeTopicTypeApiService } from '../../Data/apiServices/addMangementChangeTopicTypeApiService'

class AddMangementChangeTopicTypeRepo extends RepoInterface<PpeItemModel> {
  private static instance: AddMangementChangeTopicTypeRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMangementChangeTopicTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): PpeItemModel {
    return PpeItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddMangementChangeTopicTypeApiService.getInstance()
  }
}

export { AddMangementChangeTopicTypeRepo }
