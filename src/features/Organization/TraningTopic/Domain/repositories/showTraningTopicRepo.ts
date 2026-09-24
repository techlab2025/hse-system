import { ShowTraningTopicApiService } from '@/features/Organization/TraningTopic/Data/apiServices/showTraningTopicApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TraningTopicDetailsModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicDetailsModel'

class ShowTraningTopicRepo extends RepoInterface<TraningTopicDetailsModel> {
  private static instance: ShowTraningTopicRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTraningTopicRepo()
    }
    return this.instance
  }

  onParse(data: any): TraningTopicDetailsModel {
    return TraningTopicDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowTraningTopicApiService.getInstance()
  }
}

export { ShowTraningTopicRepo }
