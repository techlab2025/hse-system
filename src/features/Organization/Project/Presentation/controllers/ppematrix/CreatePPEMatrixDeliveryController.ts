import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type PPEActivityToolsModel from '../../../Data/models/ppematrix/PPEActivityToolsModel'
import CreatePPEMatrixDeliveryUseCase from '../../../Domain/useCase/ppematrix/CreatePPEMatrixDeliveryUseCase'

export default class CreatePPEMatrixDeliveryController extends ControllerInterface<PPEActivityToolsModel> {
  private static instance: CreatePPEMatrixDeliveryController
  private readonly useCase = new CreatePPEMatrixDeliveryUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreatePPEMatrixDeliveryController()
    return this.instance
  }

  async createPPEMatrixDelivery(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
