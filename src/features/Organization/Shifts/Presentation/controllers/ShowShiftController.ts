import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowShiftUseCase from '../../Domain/useCase/ShowShiftUseCase'
import type ShiftDetailsModel from '../../Data/models/ShiftDetailsModel'

export default class ShowShiftController extends ControllerInterface<ShiftDetailsModel> {
  private static instance: ShowShiftController

  private constructor() {
    super()
  }

  private ShowShiftUseCase = new ShowShiftUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowShiftController()
    }
    return this.instance
  }

  async showShift(params: Params) {
    this.setLoading()

    const dataState: DataState<ShiftDetailsModel> = await this.ShowShiftUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
