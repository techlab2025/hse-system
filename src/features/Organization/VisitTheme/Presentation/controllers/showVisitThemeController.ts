import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type VisitThemeDetailsModel from '../../Data/models/VisitThemeDetailsModel'
import ShowVisitThemeUseCase from '../../Domain/useCase/showVisitThemeUseCase'

export default class ShowVisitThemeController extends ControllerInterface<VisitThemeDetailsModel> {
  private static instance: ShowVisitThemeController
  private readonly useCase = new ShowVisitThemeUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new ShowVisitThemeController()
    return this.instance
  }
  async showVisitTheme(params: Params) {
    this.setLoading()
    const dataState: DataState<VisitThemeDetailsModel> = await this.useCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}
