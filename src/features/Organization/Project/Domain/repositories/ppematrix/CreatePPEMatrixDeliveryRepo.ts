import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreatePPEMatrixDeliveryApiService from '../../../Data/apiServices/ppematrix/CreatePPEMatrixDeliveryApiService'
import PPEActivityToolsModel from '../../../Data/models/ppematrix/PPEActivityToolsModel'

export default class CreatePPEMatrixDeliveryRepo extends RepoInterface<PPEActivityToolsModel> {
  private static instance: CreatePPEMatrixDeliveryRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreatePPEMatrixDeliveryRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): PPEActivityToolsModel {
    return PPEActivityToolsModel.fromMap(Array.isArray(data) ? (data[0] ?? {}) : data)
  }

  get serviceInstance(): ServicesInterface {
    return CreatePPEMatrixDeliveryApiService.getInstance()
  }
}
