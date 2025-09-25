// import LangModel from '@/features/setting/Term/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TermModel from '../../Data/models/TermModel'
import { AddTermApiService } from '../../Data/apiServices/addTermApiService'

class AddTermRepo extends RepoInterface<TermModel> {
  private static instance: AddTermRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTermRepo()
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
    return AddTermApiService.getInstance()
  }
}

export { AddTermRepo }
