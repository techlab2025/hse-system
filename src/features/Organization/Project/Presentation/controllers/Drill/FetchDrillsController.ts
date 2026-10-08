import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type DrillModel from '../../../Data/models/Drill/DrillModel'
import FetchDrillsUseCase from '../../../Domain/useCase/Drill/FetchDrillsUseCase'

export default class FetchDrillsController extends ControllerInterface<DrillModel[]> {
  private static instance: FetchDrillsController
  private readonly useCase = new FetchDrillsUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchDrillsController()
    return this.instance
  }

  async fetchDrills(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
