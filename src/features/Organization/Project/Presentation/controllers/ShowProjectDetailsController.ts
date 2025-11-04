import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ShowProjectDetailsModel from '../../Data/models/ShowProjectDeatilsModel'
import ShowProjectDetailsUseCase from '../../Domain/useCase/ShowProjectDetailsUseCase'

export default class ShowProjectDetailsController extends ControllerInterface<ShowProjectDetailsModel> {
  private static instance: ShowProjectDetailsController

  private constructor() {
    super()
  }

  private showProjectDetailsUseCase = new ShowProjectDetailsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectDetailsController()
    }
    return this.instance
  }

  async showProjectDetails(params: Params) {

    this.setLoading()

    const dataState: DataState<ShowProjectDetailsModel> =
      await this.showProjectDetailsUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
