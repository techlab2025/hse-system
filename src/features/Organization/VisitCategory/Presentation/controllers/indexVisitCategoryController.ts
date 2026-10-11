import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type VisitCategoryModel from '../../Data/models/VisitCategoryModel'
import IndexVisitCategoryUseCase from '../../Domain/useCase/indexVisitCategoryUseCase'

export default class IndexVisitCategoryController extends SelectControllerInterface<
  VisitCategoryModel[]
> {
  private static instance: IndexVisitCategoryController
  private readonly useCase = new IndexVisitCategoryUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new IndexVisitCategoryController()
    return this.instance
  }
  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<VisitCategoryModel[]> = await this.useCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}
