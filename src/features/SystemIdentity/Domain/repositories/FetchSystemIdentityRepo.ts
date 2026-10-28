import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchSystemIdentityApiService from '../../Data/apiServices/FetchSystemIdentityApiService'
import SystemIdentityModel from '../../Data/models/SystemIdentityModel'

export default class FetchSystemIdentityRepo extends RepoInterface<SystemIdentityModel> {
  private static instance: FetchSystemIdentityRepo
  static getInstance() {
    return (this.instance ??= new FetchSystemIdentityRepo())
  }
  get serviceInstance() {
    return FetchSystemIdentityApiService.getInstance()
  }
  onParse(data: Record<string, unknown> | Array<Record<string, unknown>>): SystemIdentityModel {
    const model = SystemIdentityModel.fromMap(data)

    return model
  }
}
