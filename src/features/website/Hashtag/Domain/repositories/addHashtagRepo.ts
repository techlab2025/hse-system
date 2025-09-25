// import LangModel from '@/features/setting/Hashtag/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HashtagModel from '../../Data/models/HashtagModel'
import { AddHashtagApiService } from '../../Data/apiServices/addHashtagApiService'

class AddHashtagRepo extends RepoInterface<HashtagModel> {
  private static instance: AddHashtagRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddHashtagRepo()
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
    return AddHashtagApiService.getInstance()
  }
}

export { AddHashtagRepo }
