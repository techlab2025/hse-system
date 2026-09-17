import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'
import FetchDrillPlansUseCase from '../../../Domain/useCase/Drill/FetchDrillPlansUseCase'

export default class FetchDrillPlansController extends ControllerInterface<
  DrillTimelineItemModel[]
> {
  private static instance: FetchDrillPlansController
  private readonly useCase = new FetchDrillPlansUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchDrillPlansController()
    return this.instance
  }

  async fetchPlans(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
