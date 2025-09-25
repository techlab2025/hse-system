// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HashtagModel from '../../Data/models/TermModel'
import { DeleteHashtagApiService } from '../../Data/apiServices/deleteHashtagApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteHashtagRepo extends RepoInterface<HashtagModel> {
  private static instance: DeleteHashtagRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHashtagRepo()
    }
    return this.instance
  }

  onParse(data: any): HashtagModel {
    return HashtagModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteHashtagApiService.getInstance()
  }
}

export { DeleteHashtagRepo }
