import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import DrillModel from '../../../Data/models/Drill/DrillModel'
import AddDrillUseCase from '../../../Domain/useCase/Drill/AddDrillUseCase'

export default class AddDrillController extends ControllerInterface<DrillModel> {
  private static instance: AddDrillController
  private readonly useCase = new AddDrillUseCase()
  private constructor() { super() }
  static getInstance() {
    if (!this.instance) this.instance = new AddDrillController()
    return this.instance
  }
  async addDrill(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
