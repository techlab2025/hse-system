// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TermModel from '../../Data/models/TermModel'
import { EditTermApiService } from '../../Data/apiServices/editTermApiService'

class EditTermRepo extends RepoInterface<TermModel> {
  private static instance: EditTermRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTermRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): TermModel {
    return TermModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditTermApiService.getInstance()
  }
}

export { EditTermRepo }
