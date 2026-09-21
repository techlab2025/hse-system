import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type MangementChangeModel from '../../Data/models/MangementChangeModel'
import IndexMangementChangeUseCase from '../../Domain/useCase/indexMangementChangeUseCase'

export default class IndexMangementChangeController extends SelectControllerInterface<
  MangementChangeModel[]
> {
  private static instance: IndexMangementChangeController
  private indexMangementChangeUseCase = new IndexMangementChangeUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new IndexMangementChangeController()
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<MangementChangeModel[]> =
      await this.indexMangementChangeUseCase.call(params)

    this.setState(dataState)
    super.handleResponseDialogs()
    return this.state
  }
}
