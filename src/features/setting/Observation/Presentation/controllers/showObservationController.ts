import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ShowObservationModel from '@/features/setting/Observation/Data/models/observationDetailsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowObservationUseCase from '@/features/setting/Observation/Domain/useCase/showObservationUseCase'

export default class ShowObservationController extends ControllerInterface<ShowObservationModel> {
  private static instance: ShowObservationController

  private constructor() {
    super()
  }

  private ShowObservationUseCase = new ShowObservationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowObservationController()
    }
    return this.instance
  }

  async showObservation(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowObservationModel> = await this.ShowObservationUseCase.call(params)

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
