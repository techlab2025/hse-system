import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import PpeItemModel from '../../Data/models/PpeItemModel'
import { DeletePpeItemApiService } from '../../Data/apiServices/deleteVisitThemApiService'

class DeletePpeItemRepo extends RepoInterface<PpeItemModel> {
  private static instance: DeletePpeItemRepo

   
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePpeItemRepo()
    }
    return this.instance
  }

  onParse(data: any): PpeItemModel {
    return PpeItemModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeletePpeItemApiService.getInstance()
  }
}

export { DeletePpeItemRepo }
