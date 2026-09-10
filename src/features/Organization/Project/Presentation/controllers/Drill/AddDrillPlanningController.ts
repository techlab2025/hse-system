import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import DrillModel from '../../../Data/models/Drill/DrillModel'
import AddDrillPlanningUseCase from '../../../Domain/useCase/Drill/AddDrillPlanningUseCase'

export default class AddDrillPlanningController extends ControllerInterface<DrillModel> {
  private static instance: AddDrillPlanningController
  private readonly useCase = new AddDrillPlanningUseCase()
  private constructor() { super() }
  static getInstance() {
    if (!this.instance) this.instance = new AddDrillPlanningController()
    return this.instance
  }
  async addPlanning(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
