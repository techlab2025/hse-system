import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import CreatePPEActivityToolApiService from '../../../Data/apiServices/ppematrix/CreatePPEActivityToolApiService'
import PPEActivityToolsModel from '../../../Data/models/ppematrix/PPEActivityToolsModel'

export default class CreatePPEActivityToolRepo extends RepoInterface<PPEActivityToolsModel> {
  private static instance: CreatePPEActivityToolRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreatePPEActivityToolRepo()
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: Record<string, unknown> | Record<string, unknown>[]): PPEActivityToolsModel {
    return PPEActivityToolsModel.fromMap(Array.isArray(data) ? (data[0] ?? {}) : data)
  }

  get serviceInstance(): ServicesInterface {
    return CreatePPEActivityToolApiService.getInstance()
  }
}
