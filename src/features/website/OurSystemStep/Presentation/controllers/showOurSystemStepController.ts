import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type OurSystemStepteDetailsModel from '../../Data/models/OurSystemStepDetailsModel'
import ShowOurSystemStepteUseCase from '../../Domain/useCase/showOurSystemStepUseCase'

export default class ShowOurSystemStepteController extends ControllerInterface<OurSystemStepteDetailsModel> {
  private static instance: ShowOurSystemStepteController

  private constructor() {
    super()
  }

  private ShowOurSystemStepteUseCase = new ShowOurSystemStepteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOurSystemStepteController()
    }
    return this.instance
  }

  async showOurSystemStep(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<OurSystemStepteDetailsModel> =
      await this.ShowOurSystemStepteUseCase.call(params)

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
