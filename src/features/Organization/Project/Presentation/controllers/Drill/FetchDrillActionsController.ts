import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'
import FetchDrillActionsUseCase from '../../../Domain/useCase/Drill/FetchDrillActionsUseCase'

export default class FetchDrillActionsController extends ControllerInterface<
  DrillTimelineItemModel[]
> {
  private static instance: FetchDrillActionsController
  private readonly useCase = new FetchDrillActionsUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchDrillActionsController()
    return this.instance
  }

  async fetchActions(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
