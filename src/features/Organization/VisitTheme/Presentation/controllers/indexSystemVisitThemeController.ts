import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type VisitThemeModel from '../../Data/models/VisitThemeModel'
import IndexVisitThemeUseCase from '../../Domain/useCase/indexVisitThemeUseCase'

export default class IndexSystemVisitThemeController extends SelectControllerInterface<VisitThemeModel[]> {
  private static instance: IndexSystemVisitThemeController
  private readonly useCase = new IndexVisitThemeUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexSystemVisitThemeController()
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<VisitThemeModel[]> = await this.useCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}
