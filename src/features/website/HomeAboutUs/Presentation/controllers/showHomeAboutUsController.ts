import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type HomeAboutUsDetailsModel from '../../Data/models/HomeAboutUsDetailsModel'
import ShowHomeAboutUsUseCase from '../../Domain/useCase/showHomeAboutUsUseCase'


export default class ShowHomeAboutUsController extends ControllerInterface<HomeAboutUsDetailsModel> {
  private static instance: ShowHomeAboutUsController

  private constructor() {
    super()
  }

  private ShowHomeAboutUsUseCase = new ShowHomeAboutUsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowHomeAboutUsController()
    }
    return this.instance
  }

  async showHomeAboutUs(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<HomeAboutUsDetailsModel> = await this.ShowHomeAboutUsUseCase.call(params)

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
