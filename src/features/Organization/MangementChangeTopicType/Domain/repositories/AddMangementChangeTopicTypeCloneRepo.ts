// import LangModel from '@/features/setting/PpeItem/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddMangementChangeTopicTypeClonesApiService } from '../../Data/apiServices/AddPpeItemClonesApiService'
import MangementChangeTopicTypeModel from '../../Data/models/MangementChangeTopicTypeModel'

class AddMangementChangeTopicTypeCloneRepo extends RepoInterface<MangementChangeTopicTypeModel> {
  private static instance: AddMangementChangeTopicTypeCloneRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMangementChangeTopicTypeCloneRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): MangementChangeTopicTypeModel {
    return MangementChangeTopicTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddMangementChangeTopicTypeClonesApiService.getInstance()
  }
}

export { AddMangementChangeTopicTypeCloneRepo }
