import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchLeadershipVisitDetailsApiService from '../../../Data/apiServices/Leadership/FetchLeadershipVisitDetailsApiService'
import LeadershipVisitDetailsModel from '../../../Data/models/Leadership/LeadershipVisitDetailsModel'

export default class FetchLeadershipVisitDetailsRepo extends RepoInterface<LeadershipVisitDetailsModel> {
  private static instance: FetchLeadershipVisitDetailsRepo

  private constructor() {
    super()
  }

  static getInstance(): FetchLeadershipVisitDetailsRepo {
    if (!this.instance) this.instance = new FetchLeadershipVisitDetailsRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): LeadershipVisitDetailsModel {
    return LeadershipVisitDetailsModel.fromMap(Array.isArray(data) ? (data[0] ?? {}) : data)
  }

  get serviceInstance(): ServicesInterface {
    return FetchLeadershipVisitDetailsApiService.getInstance()
  }
}
