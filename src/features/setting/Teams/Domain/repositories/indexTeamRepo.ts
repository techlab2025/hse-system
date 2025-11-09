// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexTeamApiService } from '../../Data/apiServices/indexTeamApiService'
import TeamModel from '../../Data/models/TeamModel'

class IndexTeamRepo extends RepoInterface<TeamModel[]> {
  private static instance: IndexTeamRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTeamRepo()
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
    return IndexTeamApiService.getInstance()
  }
}

export { IndexTeamRepo }
