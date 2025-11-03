// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { EditTeamApiService } from '../../Data/apiServices/editTeamApiService'
import TeamModel from '../../Data/models/TeamModel'

class EditTeamRepo extends RepoInterface<TeamModel> {
  private static instance: EditTeamRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTeamRepo()
    }
    return this.instance
  }

  onParse(data: any): TeamModel {
    return TeamModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditTeamApiService.getInstance()
  }
}

export { EditTeamRepo }
