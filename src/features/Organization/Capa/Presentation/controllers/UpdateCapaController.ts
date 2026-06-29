// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ShowCapaDetailsModel from '../../Data/models/ShowCapaDetailsModel'
import UpdateCapaUseCase from '../../Domain/useCase/UpdateCapaUseCase'

export default class UpdateCapaController extends SelectControllerInterface<ShowCapaDetailsModel> {
  private static instance: UpdateCapaController
  private constructor() {
    super()
  }
  private updateCapaUseCase = new UpdateCapaUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateCapaController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<ShowCapaDetailsModel> = await this.updateCapaUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
