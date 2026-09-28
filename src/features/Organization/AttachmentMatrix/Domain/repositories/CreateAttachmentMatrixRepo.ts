import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreateAttachmentMatrixApiService from '../../Data/apiServices/CreateAttachmentMatrixApiService'
import AttachmentMatrixModel from '../../Data/models/AttachmentMatrixModel'

export default class CreateAttachmentMatrixRepo extends RepoInterface<AttachmentMatrixModel> {
  private static instance: CreateAttachmentMatrixRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreateAttachmentMatrixRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown>): AttachmentMatrixModel {
    return AttachmentMatrixModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return CreateAttachmentMatrixApiService.getInstance()
  }
}
