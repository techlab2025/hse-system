import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import type PPEActivityToolsModel from '../../../Data/models/ppematrix/PPEActivityToolsModel'
import CreatePPEActivityToolUseCase from '../../../Domain/useCase/ppematrix/CreatePPEActivityToolUseCase'

export default class CreatePPEActivityToolController extends ControllerInterface<PPEActivityToolsModel> {
  private static instance: CreatePPEActivityToolController
  private readonly useCase = new CreatePPEActivityToolUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreatePPEActivityToolController()
    return this.instance
  }

  async createPPEActivityTool(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    this.handleResponseDialogs()
    return this.state
  }
}
