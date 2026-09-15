import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import { AddCodingSystemApiService } from '../../Data/apiServices/addSerialNumApiService'
import SerialNumberModel from '../../Data/models/serialNumberModel'
import { ShowSerialNumberApiService } from '../../Data/apiServices/ShowSerialNumberApiServuce'

class ShowSerialNumberRepo extends RepoInterface<SerialNumberModel[]> {
  private static instance: ShowSerialNumberRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowSerialNumberRepo()
    }
    return this.instance
  }

  // override get responseType(): ResponseType {
  //   return ResponseType.withoutData
  // }

  onParse(data: any): SerialNumberModel[] {
    return data.map((item: any) => SerialNumberModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return ShowSerialNumberApiService.getInstance()
  }
}

export { ShowSerialNumberRepo }
