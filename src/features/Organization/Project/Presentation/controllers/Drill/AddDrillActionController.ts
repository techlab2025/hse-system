import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type Params from '@/base/core/params/params'
import DrillModel from '../../../Data/models/Drill/DrillModel'
import AddDrillActionUseCase from '../../../Domain/useCase/Drill/AddDrillActionUseCase'

export default class AddDrillActionController extends ControllerInterface<DrillModel> {
  private static instance: AddDrillActionController
  private readonly useCase = new AddDrillActionUseCase()
  private constructor() { super() }
  static getInstance() {
    if (!this.instance) this.instance = new AddDrillActionController()
    return this.instance
  }
  async addAction(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    super.handleResponseDialogs()
    return this.state
  }
}
