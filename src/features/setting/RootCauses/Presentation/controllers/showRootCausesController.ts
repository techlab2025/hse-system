import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type RootCausesModel from '../../Data/models/RootCausesModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowRootCausesUseCase from '../../Domain/useCase/showRootCausesUseCase'

export default class ShowRootCausesController extends ControllerInterface<RootCausesModel> {
  private static instance: ShowRootCausesController

  private constructor() {
    super()
  }

  private ShowRootCausesUseCase = new ShowRootCausesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowRootCausesController()
    }
    return this.instance
  }

  async showRootCauses(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<RootCausesModel> = await this.ShowRootCausesUseCase.call(params)

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
