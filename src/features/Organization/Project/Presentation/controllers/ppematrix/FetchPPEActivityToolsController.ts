import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type PPEActivityToolsModel from '../../../Data/models/ppematrix/PPEActivityToolsModel'
import FetchPPEActivityToolsUseCase from '../../../Domain/useCase/ppematrix/FetchPPEActivityToolsUseCase'

export default class FetchPPEActivityToolsController extends ControllerInterface<PPEActivityToolsModel[]> {
  private static instance: FetchPPEActivityToolsController
  private readonly useCase = new FetchPPEActivityToolsUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchPPEActivityToolsController()
    return this.instance
  }

  async fetchPPEActivityTools(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
