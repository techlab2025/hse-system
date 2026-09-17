import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexSystemTeamApiService } from '../../Data/apiServices/indexSystemTeamApiService'
import TeamModel from '../../Data/models/TeamModel'

class IndexSystemTeamRepo extends RepoInterface<TeamModel[]> {
  private static instance: IndexSystemTeamRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemTeamRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TeamModel[] {
    return data.map((item: any) => TeamModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexSystemTeamApiService.getInstance()
  }
}

export { IndexSystemTeamRepo }
