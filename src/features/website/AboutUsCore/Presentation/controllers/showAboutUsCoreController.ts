import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type AboutUsCoreDetailsModel from '../../Data/models/AboutUsCoreDetailsModel'
import ShowAboutUsCoreUseCase from '../../Domain/useCase/showAboutUsCoreUseCase'


export default class ShowAboutUsCoreController extends ControllerInterface<AboutUsCoreDetailsModel> {
  private static instance: ShowAboutUsCoreController

  private constructor() {
    super()
  }

  private ShowAboutUsCoreUseCase = new ShowAboutUsCoreUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAboutUsCoreController()
    }
    return this.instance
  }

  async showAboutUsCore(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<AboutUsCoreDetailsModel> = await this.ShowAboutUsCoreUseCase.call(params)

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
