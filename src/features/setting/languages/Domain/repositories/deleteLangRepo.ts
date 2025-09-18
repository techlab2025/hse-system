import { DeleteLangApiService } from '@/features/setting/languages/Data/apiServices/deleteLangApiService.ts'
// import ClientModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import LangModel from '@/features/setting/languages/Data/models/langModel.ts'

class DeleteLangRepo extends RepoInterface<LangModel> {
  private static instance: DeleteLangRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteLangRepo()
    }
    return this.instance
  }

  onParse(data: any): LangModel {
    return LangModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteLangApiService.getInstance()
  }
}

export { DeleteLangRepo }
