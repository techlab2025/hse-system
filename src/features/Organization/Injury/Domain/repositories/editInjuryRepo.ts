import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import type InjuryModel from '../../Data/models/InjuryModel'
import { EditInjuryApiService } from '../../Data/apiServices/editInjuryApiService'


class EditInjuryRepo extends RepoInterface<InjuryModel> {
  private static instance: EditInjuryRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditInjuryRepo()
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
    return EditInjuryApiService.getInstance()
  }
}

export { EditInjuryRepo }
