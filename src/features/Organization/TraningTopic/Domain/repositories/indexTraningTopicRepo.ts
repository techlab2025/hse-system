import { IndexTraningTopicApiService } from '@/features/Organization/TraningTopic/Data/apiServices/indexTraningTopicApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TraningTopicModel from '@/features/Organization/TraningTopic/Data/models/TraningTopicModel'

class IndexTraningTopicRepo extends RepoInterface<TraningTopicModel[]> {
  private static instance: IndexTraningTopicRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTraningTopicRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TraningTopicModel[] {
    return data.map((item: any) => TraningTopicModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexTraningTopicApiService.getInstance()
  }
}

export { IndexTraningTopicRepo }
