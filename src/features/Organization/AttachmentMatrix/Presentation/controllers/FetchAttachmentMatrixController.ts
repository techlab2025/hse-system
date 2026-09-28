import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type AttachmentMatrixModel from '../../Data/models/AttachmentMatrixModel'
import FetchAttachmentMatrixUseCase from '../../Domain/useCase/FetchAttachmentMatrixUseCase'

export default class FetchAttachmentMatrixController extends ControllerInterface<AttachmentMatrixModel> {
  private static instance: FetchAttachmentMatrixController
  private readonly useCase = new FetchAttachmentMatrixUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchAttachmentMatrixController()
    return this.instance
  }

  async fetch(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
