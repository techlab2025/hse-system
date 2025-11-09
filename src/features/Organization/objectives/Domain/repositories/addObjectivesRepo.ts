// import LangModel from '@/features/setting/ObjectivesType/Data/models/langModel.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObjectivesModel from '../../Data/models/objectivesModel'
import { AddObjectivesApiService } from '../../Data/apiServices/addObjectivesApiService'

class AddObjectivesRepo extends RepoInterface<ObjectivesModel> {
  private static instance: AddObjectivesRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddObjectivesRepo()
    }
    return this.instance
  }

  onParse(data: any): ObjectivesModel {
    return ObjectivesModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddObjectivesApiService.getInstance()
  }
}

export { AddObjectivesRepo }
