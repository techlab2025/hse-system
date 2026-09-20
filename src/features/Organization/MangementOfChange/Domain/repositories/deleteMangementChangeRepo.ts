import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MangementChangeModel from '../../Data/models/MangementChangeModel'
import { DeleteMangementChangeApiService } from '../../Data/apiServices/deleteMangementChangeApiService'

class DeleteMangementChangeRepo extends RepoInterface<MangementChangeModel> {
  private static instance: DeleteMangementChangeRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteMangementChangeRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): MangementChangeModel {
    return MangementChangeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteMangementChangeApiService.getInstance()
  }
}

export { DeleteMangementChangeRepo }
