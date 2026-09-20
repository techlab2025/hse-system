import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'
import DeleteDrillActionUseCase from '../../../Domain/useCase/Drill/DeleteDrillActionUseCase'

export default class DeleteDrillActionController extends ControllerInterface<DrillTimelineItemModel> {
  private static instance: DeleteDrillActionController
  private readonly useCase = new DeleteDrillActionUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteDrillActionController()
    return this.instance
  }

  async deleteAction(params: Params) {
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
