import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import { ShowTeamApiService } from '../../Data/apiServices/showTeamApiService'
import TeamDetailsModel from '../../Data/models/TeamDetailsModel'

class ShowTeamRepo extends RepoInterface<TeamDetailsModel> {
  private static instance: ShowTeamRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTeamRepo()
    }
    return this.instance
  }

  onParse(data: any): TeamDetailsModel {
    return TeamDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowTeamApiService.getInstance()
  }
}

export { ShowTeamRepo }
