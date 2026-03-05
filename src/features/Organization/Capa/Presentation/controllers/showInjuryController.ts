import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type InjuryDetailsModel from '../../Data/models/InjuryDetailsModel'
import ShowInjuryUseCase from '../../Domain/useCase/showInjuryUseCase'

export default class ShowInjuryteController extends ControllerInterface<InjuryDetailsModel> {
  private static instance: ShowInjuryteController

  private constructor() {
    super()
  }

  private ShowInjuryUseCase = new ShowInjuryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowInjuryteController()
    }
    return this.instance
  }

  async showInjury(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<InjuryDetailsModel> =
      await this.ShowInjuryUseCase.call(params)

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
