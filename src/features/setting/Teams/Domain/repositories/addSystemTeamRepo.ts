import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddSystemTeamApiService } from '../../Data/apiServices/addSystemTeamApiService'
import TeamModel from '../../Data/models/TeamModel'

class AddSystemTeamRepo extends RepoInterface<TeamModel> {
  private static instance: AddSystemTeamRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddSystemTeamRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): TeamModel {
    return TeamModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddSystemTeamApiService.getInstance()
  }
}

export { AddSystemTeamRepo }
