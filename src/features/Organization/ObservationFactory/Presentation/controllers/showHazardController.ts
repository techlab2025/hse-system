import { ShowHazardModel } from '@/features/setting/Hazard/Data/models/HazardDetailsModel'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowHazardUseCase from '../../Domain/useCase/showHazardUseCase'

export default class ShowHazardController extends ControllerInterface<ShowHazardModel> {
  private static instance: ShowHazardController

  private constructor() {
    super()
  }

  private ShowHazardUseCase = new ShowHazardUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHazardController()
    }
    return this.instance
  }

  async showHazard(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowHazardModel> = await this.ShowHazardUseCase.call(params)

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
