import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type VisitCategoryDetailsModel from '../../Data/models/VisitCategoryDetailsModel'
import ShowVisitCategoryUseCase from '../../Domain/useCase/showVisitCategoryUseCase'

export default class ShowVisitCategoryController extends ControllerInterface<VisitCategoryDetailsModel> {
  private static instance: ShowVisitCategoryController
  private readonly useCase = new ShowVisitCategoryUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new ShowVisitCategoryController()
    return this.instance
  }
  async showVisitCategory(params: Params) {
    this.setLoading()
    const dataState: DataState<VisitCategoryDetailsModel> = await this.useCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}
