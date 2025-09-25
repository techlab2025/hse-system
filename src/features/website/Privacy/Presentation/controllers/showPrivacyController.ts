import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type PrivacyDetailsModel from '../../Data/models/PrivacyDetailsModel'
import ShowPrivacyUseCase from '../../Domain/useCase/showPrivacyUseCase'

export default class ShowPrivacyController extends ControllerInterface<PrivacyDetailsModel> {
  private static instance: ShowPrivacyController

  private constructor() {
    super()
  }

  private ShowPrivacyUseCase = new ShowPrivacyUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowPrivacyController()
    }
    return this.instance
  }

  async showPrivacy(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<PrivacyDetailsModel> =
      await this.ShowPrivacyUseCase.call(params)

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
