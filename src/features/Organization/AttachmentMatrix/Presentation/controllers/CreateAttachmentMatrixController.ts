import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type AttachmentMatrixModel from '../../Data/models/AttachmentMatrixModel'
import CreateAttachmentMatrixUseCase from '../../Domain/useCase/CreateAttachmentMatrixUseCase'

export default class CreateAttachmentMatrixController extends ControllerInterface<AttachmentMatrixModel> {
  private static instance: CreateAttachmentMatrixController
  private readonly useCase = new CreateAttachmentMatrixUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new CreateAttachmentMatrixController()
    return this.instance
  }

  async create(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
