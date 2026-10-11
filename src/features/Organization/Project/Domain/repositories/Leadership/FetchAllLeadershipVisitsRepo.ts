import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchAllLeadershipVisitsApiService from '../../../Data/apiServices/Leadership/FetchAllLeadershipVisitsApiService'
import LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'

export default class FetchAllLeadershipVisitsRepo extends RepoInterface<LeadershipVisitModel[]> {
  private static instance: FetchAllLeadershipVisitsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchAllLeadershipVisitsRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): LeadershipVisitModel[] {
    return Array.isArray(data) ? data.map((item) => LeadershipVisitModel.fromMap(item)) : []
  }

  get serviceInstance(): ServicesInterface {
    return FetchAllLeadershipVisitsApiService.getInstance()
  }
}
