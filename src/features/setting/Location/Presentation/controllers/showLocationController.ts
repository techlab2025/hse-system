import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type LocationDetailsModel from '../../Data/models/LocationDetailsModel'
import ShowLocationUseCase from '../../Domain/useCase/showLocationUseCase'

export default class ShowLocationController extends ControllerInterface<LocationDetailsModel> {
  private static instance: ShowLocationController

  private constructor() {
    super()
  }

  private showLocationUseCase = new ShowLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowLocationController()
    }
    return this.instance
  }

  async showLocation(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<LocationDetailsModel> =
      await this.showLocationUseCase.call(params)

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
