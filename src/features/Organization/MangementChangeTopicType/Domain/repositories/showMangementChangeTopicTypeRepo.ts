import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { ShowMangementChangeTopicTypeApiService } from '../../Data/apiServices/showMangementChangeTopicTypeApiService'
import PpeItemDetailsModel from '../../Data/models/MangementChangeTopicTypeDetailsModel'

class ShowMangementChangeTopicTypeRepo extends RepoInterface<PpeItemDetailsModel> {
  private static instance: ShowMangementChangeTopicTypeRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowMangementChangeTopicTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): PpeItemDetailsModel {
    return PpeItemDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowMangementChangeTopicTypeApiService.getInstance()
  }
}

export { ShowMangementChangeTopicTypeRepo }
