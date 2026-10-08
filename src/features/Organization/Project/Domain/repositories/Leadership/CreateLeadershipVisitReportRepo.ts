import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreateLeadershipVisitReportApiService from '../../../Data/apiServices/Leadership/CreateLeadershipVisitReportApiService'
import LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'

export default class CreateLeadershipVisitReportRepo extends RepoInterface<LeadershipVisitModel> {
  private static instance: CreateLeadershipVisitReportRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreateLeadershipVisitReportRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): LeadershipVisitModel {
    return LeadershipVisitModel.fromMap(Array.isArray(data) ? (data[0] ?? {}) : data)
  }

  get serviceInstance(): ServicesInterface {
    return CreateLeadershipVisitReportApiService.getInstance()
  }
}
