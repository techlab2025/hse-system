import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { FetchProjectZonesApiService } from '../../Data/apiServices/fetchProjectZonesApiService'
import ProjectZoneModel from '../../Data/models/ProjectZonesModel'

class FetchProjectZoneRepo extends RepoInterface<ProjectZoneModel[]> {
  private static instance: FetchProjectZoneRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectZoneRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ProjectZoneModel[] {
    return data.map((item: any) => ProjectZoneModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchProjectZonesApiService.getInstance()
  }
}

export { FetchProjectZoneRepo }
