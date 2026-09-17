// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import ShowCapaDetailsUseCase from '../../Domain/useCase/ShowCapaDetailsUseCase'
import type ShowCapaDetailsModel from '../../Data/models/ShowCapaDetailsModel'

export default class ShowCapaDetailsController extends SelectControllerInterface<ShowCapaDetailsModel> {
  private static instance: ShowCapaDetailsController
  private constructor() {
    super()
  }
  private showCapaDetailsUseCase = new ShowCapaDetailsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCapaDetailsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<ShowCapaDetailsModel> =
      await this.showCapaDetailsUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
