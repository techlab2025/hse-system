import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import MangementChangeModel from '../../Data/models/MangementChangeModel'
import { EditMangementChangeApiService } from '../../Data/apiServices/editMangementChangeApiService'

class EditMangementChangeRepo extends RepoInterface<MangementChangeModel> {
  private static instance: EditMangementChangeRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new EditMangementChangeRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): MangementChangeModel {
    return MangementChangeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditMangementChangeApiService.getInstance()
  }
}

export { EditMangementChangeRepo }
