// import LangModel from '@/features/setting/TeamType/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddTeamApiService } from '../../Data/apiServices/addTeamApiService'
import TeamModel from '../../Data/models/TeamModel'

class AddTeamRepo extends RepoInterface<TeamModel> {
  private static instance: AddTeamRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTeamRepo()
    }
    return this.instance
  }

  onParse(data: any): TeamModel {
    return TeamModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddTeamApiService.getInstance()
  }
}

export { AddTeamRepo }
