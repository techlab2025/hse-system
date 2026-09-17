// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexCapaUseCase from '../../Domain/useCase/indexCapaUseCase'
import type IndexCapaModel from '../../Data/models/IndexCapaModel'

export default class IndexCapaController extends SelectControllerInterface<IndexCapaModel[]> {
  private static instance: IndexCapaController
  private constructor() {
    super()
  }
  private indexCapaUseCase = new IndexCapaUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCapaController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<IndexCapaModel[]> = await this.indexCapaUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
