import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type AboutUsFeatureDetailsModel from '../../Data/models/AboutUsFeatureDetailsModel'
import ShowAboutUsFeatureUseCase from '../../Domain/useCase/showAboutUsFeatureUseCase'




export default class ShowAboutUsFeatureController extends ControllerInterface<AboutUsFeatureDetailsModel> {
  private static instance: ShowAboutUsFeatureController

  private constructor() {
    super()
  }

  private ShowAboutUsFeatureUseCase = new ShowAboutUsFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAboutUsFeatureController()
    }
    return this.instance
  }

  async showAboutUsFeature(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<AboutUsFeatureDetailsModel> = await this.ShowAboutUsFeatureUseCase.call(params)

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
