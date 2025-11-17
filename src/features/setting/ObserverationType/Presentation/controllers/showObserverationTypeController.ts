import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ShowObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeDetailsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowObserverationTypeUseCase from '@/features/setting/ObserverationType/Domain/useCase/showObserverationTypeUseCase'

export default class ShowObserverationTypeController extends ControllerInterface<ShowObserverationTypeModel> {
  private static instance: ShowObserverationTypeController

  private constructor() {
    super()
  }

  private ShowObserverationTypeUseCase = new ShowObserverationTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowObserverationTypeController()
    }
    return this.instance
  }

  async showObserverationType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowObserverationTypeModel> = await this.ShowObserverationTypeUseCase.call(params)

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
