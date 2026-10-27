import { translate as localizeUi } from '@/localization/i18n'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import CreateSystemIdentityApiService from '../../Data/apiServices/CreateSystemIdentityApiService'
import SystemIdentityModel from '../../Data/models/SystemIdentityModel'

export default class CreateSystemIdentityRepo extends RepoInterface<SystemIdentityModel> {
  private static instance: CreateSystemIdentityRepo
  static getInstance() {
    return (this.instance ??= new CreateSystemIdentityRepo())
  }
  get serviceInstance() {
    return CreateSystemIdentityApiService.getInstance()
  }
  onParse(data: Record<string, unknown>): SystemIdentityModel {
    const model = SystemIdentityModel.fromMap(data)
    if (!model.identity)
      throw new Error(localizeUi('The saved identity is missing from the response'))
    return model
  }
}
