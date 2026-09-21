import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'
import DeleteDrillPlanUseCase from '../../../Domain/useCase/Drill/DeleteDrillPlanUseCase'

export default class DeleteDrillPlanController extends ControllerInterface<DrillTimelineItemModel> {
  private static instance: DeleteDrillPlanController
  private readonly useCase = new DeleteDrillPlanUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new DeleteDrillPlanController()
    return this.instance
  }

  async deletePlan(params: Params) {
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
