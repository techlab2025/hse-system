import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ShiftModel from '../../Data/models/ShiftModel'
import IndexShiftUseCase from '../../Domain/useCase/IndexShiftUseCase'

export default class IndexShiftController extends SelectControllerInterface<ShiftModel[]> {
  private static instance: IndexShiftController
  private constructor() {
    super()
  }
  private IndexShiftUseCase = new IndexShiftUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexShiftController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<ShiftModel[]> = await this.IndexShiftUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
