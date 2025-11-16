// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexObserverationTypeUseCase from '@/features/setting/ObserverationType/Domain/useCase/indexObserverationTypeUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexObserverationTypeController extends SelectControllerInterface<
  ObserverationTypeModel[]
> {
  private static instance: IndexObserverationTypeController
  private constructor() {
    super()
  }
  private IndexObserverationTypeUseCase = new IndexObserverationTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexObserverationTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ObserverationTypeModel[]> =
      await this.IndexObserverationTypeUseCase.call(params)

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
