// import LangModel from '@/features/setting/Injury/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import type InjuryModel from '../../Data/models/InjuryModel'
import { AddInjuryclonesApiService } from '../../Data/apiServices/addInjurycloneApiService'

class AddInjuryclonesRepo extends RepoInterface<InjuryModel> {
  private static instance: AddInjuryclonesRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInjuryclonesRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): InjuryModel {
    return InjuryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddInjuryclonesApiService.getInstance()
  }
}

export { AddInjuryclonesRepo }
