import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import GetTodayTalkApiService from '../../../Data/apiServices/TodayTalk/GetTodayTalkApiService'
import TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'

export default class GetTodayTalkRepo extends RepoInterface<TodayTalkModel> {
  private static instance: GetTodayTalkRepo

  private constructor() {
    super()
  }

  static getInstance(): GetTodayTalkRepo {
    if (!this.instance) this.instance = new GetTodayTalkRepo()
    return this.instance
  }

  onParse(data: Record<string, unknown>): TodayTalkModel {
    return TodayTalkModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return GetTodayTalkApiService.getInstance()
  }
}
