import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import  InjuryModel from '../../Data/models/InjuryModel'
import { DeleteInjuryApiService } from '../../Data/apiServices/deleteInjuryApiService'

class DeleteInjuryRepo extends RepoInterface<InjuryModel> {
  private static instance: DeleteInjuryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteInjuryRepo()
    }
    return this.instance
  }

  onParse(data: any): InjuryModel {
    return InjuryModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteInjuryApiService.getInstance()
  }
}

export { DeleteInjuryRepo }
