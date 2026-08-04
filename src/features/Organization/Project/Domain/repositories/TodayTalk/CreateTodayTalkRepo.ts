import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreateTodayTalkApiService from '../../../Data/apiServices/TodayTalk/CreateTodayTalkApiService'
import TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'

export default class CreateTodayTalkRepo extends RepoInterface<TodayTalkModel> {
  private static instance: CreateTodayTalkRepo

  private constructor() {
    super()
  }

  static getInstance(): CreateTodayTalkRepo {
    if (!this.instance) this.instance = new CreateTodayTalkRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): TodayTalkModel {
    return TodayTalkModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return CreateTodayTalkApiService.getInstance()
  }
}
