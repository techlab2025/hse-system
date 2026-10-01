import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type PPEMatrixDeliveryModel from '../../../Data/models/ppematrix/PPEMatrixDeliveryModel'
import FetchPPEMatrixDeliveriesUseCase from '../../../Domain/useCase/ppematrix/FetchPPEMatrixDeliveriesUseCase'

export default class FetchPPEMatrixDeliveriesController extends ControllerInterface<
  PPEMatrixDeliveryModel[]
> {
  private static instance: FetchPPEMatrixDeliveriesController
  private readonly useCase = new FetchPPEMatrixDeliveriesUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchPPEMatrixDeliveriesController()
    return this.instance
  }

  async fetchPPEMatrixDeliveries(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
