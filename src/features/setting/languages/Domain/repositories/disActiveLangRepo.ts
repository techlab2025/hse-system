import { DisActiveLangApiService } from '@/features/setting/languages/Data/apiServices/disActiveLangApiService.ts'
import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'

class DisActiveLangRepo extends RepoInterface<LangModel> {
  private static instance: DisActiveLangRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveLangRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): LangModel {
    return LangModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisActiveLangApiService.getInstance()
  }
}

export { DisActiveLangRepo }
