// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ObservationModel from '@/features/setting/Observation/Data/models/observationModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexObservationUseCase from '@/features/setting/Observation/Domain/useCase/indexObservationUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexObservationController extends SelectControllerInterface<
  ObservationModel[]
> {
  private static instance: IndexObservationController
  private constructor() {
    super()
  }
  private IndexObservationUseCase = new IndexObservationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexObservationController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ObservationModel[]> =
      await this.IndexObservationUseCase.call(params)

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
