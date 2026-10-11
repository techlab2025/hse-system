import { AddTraningTopicApiService } from '@/features/Organization/TraningTopic/Data/apiServices/addTraningTopicApiService.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

class AddTraningTopicRepo extends RepoInterface<TraningTopicModel> {
  private static instance: AddTraningTopicRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTraningTopicRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): TraningTopicModel {
    return TraningTopicModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddTraningTopicApiService.getInstance()
  }
}

export { AddTraningTopicRepo }
