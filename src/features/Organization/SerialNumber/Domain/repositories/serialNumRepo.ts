import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { AddCodingSystemApiService } from '../../Data/apiServices/addSerialNumApiService'
import SerialNumberModel from '../../Data/models/serialNumberModel'

class SerialNumberRepo extends RepoInterface<SerialNumberModel> {
  private static instance: SerialNumberRepo
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new SerialNumberRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): SerialNumberModel {
    return SerialNumberModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return AddCodingSystemApiService.getInstance()
  }
}

export { SerialNumberRepo }
