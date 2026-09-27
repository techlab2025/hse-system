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
    const response = Array.isArray(data) ? (data[0] ?? {}) : data
    const visit = response.visit
    return LeadershipVisitDetailsModel.fromMap(
      visit && typeof visit === 'object' ? (visit as Record<string, unknown>) : response,
    )
  }

  get serviceInstance(): ServicesInterface {
    return FetchLeadershipVisitDetailsApiService.getInstance()
  }
}
