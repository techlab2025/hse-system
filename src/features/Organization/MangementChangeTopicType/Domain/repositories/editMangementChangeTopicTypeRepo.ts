import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PpeItemModel from '../../Data/models/MangementChangeTopicTypeModel'
import { EditMangementChangeTopicTypeApiService } from '../../Data/apiServices/editMangementChangeTopicTypeApiService'


class EditMangementChangeTopicTypeRepo extends RepoInterface<PpeItemModel> {
  private static instance: EditMangementChangeTopicTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditMangementChangeTopicTypeRepo()
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
    return EditMangementChangeTopicTypeApiService.getInstance()
  }
}

export { EditMangementChangeTopicTypeRepo }
