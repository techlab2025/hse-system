// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HashtagModel from '../../Data/models/TermModel'
import { EditHashtagApiService } from '../../Data/apiServices/editHashtagApiService'

class EditHashtagRepo extends RepoInterface<HashtagModel> {
  private static instance: EditHashtagRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHashtagRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): HashtagModel {
    return HashtagModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditHashtagApiService.getInstance()
  }
}

export { EditHashtagRepo }
