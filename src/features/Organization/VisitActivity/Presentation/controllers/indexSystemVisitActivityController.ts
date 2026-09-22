import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type VisitActivityModel from '../../Data/models/VisitActivityModel'
import IndexVisitActivityUseCase from '../../Domain/useCase/indexVisitActivityUseCase'

export default class IndexSystemVisitActivityController extends SelectControllerInterface<VisitActivityModel[]> {
  private static instance: IndexSystemVisitActivityController
  private readonly useCase = new IndexVisitActivityUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexSystemVisitActivityController()
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<VisitActivityModel[]> = await this.useCase.call(params)
    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}
