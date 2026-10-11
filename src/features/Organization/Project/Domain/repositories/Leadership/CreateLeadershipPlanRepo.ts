import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreateLeadershipPlanApiService from '../../../Data/apiServices/Leadership/CreateLeadershipPlanApiService'
import LeadershipVisitModel from '../../../Data/models/Leadership/LeadershipVisitModel'

export default class CreateLeadershipPlanRepo extends RepoInterface<LeadershipVisitModel> {
  private static instance: CreateLeadershipPlanRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreateLeadershipPlanRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): LeadershipVisitModel {
    return LeadershipVisitModel.fromMap(Array.isArray(data) ? (data[0] ?? {}) : data)
  }

  get serviceInstance(): ServicesInterface {
    return CreateLeadershipPlanApiService.getInstance()
  }
}
