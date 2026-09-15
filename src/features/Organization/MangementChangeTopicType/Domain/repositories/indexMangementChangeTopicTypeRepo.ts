import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexMangementChangeTopicTypeApiService } from '../../Data/apiServices/indexMangementChangeTopicTypeApiService'
import PpeItemModel from '../../Data/models/MangementChangeTopicTypeModel'

class IndexMangementChangeTopicTypeRepo extends RepoInterface<PpeItemModel[]> {
  private static instance: IndexMangementChangeTopicTypeRepo

   
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexMangementChangeTopicTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): PpeItemModel[] {
    return data.map((item: any) => PpeItemModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexMangementChangeTopicTypeApiService.getInstance()
  }
}

export { IndexMangementChangeTopicTypeRepo }
