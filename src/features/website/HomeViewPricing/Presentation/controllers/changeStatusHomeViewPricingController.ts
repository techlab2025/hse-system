import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import ChangeStatusHomeViewPricingUseCase from '../../Domain/useCase/changeStatusHomeViewPricingUseCase'





export default class ChangeStatusHomeViewPricingController extends ControllerInterface<HomeViewPricingModel> {
  private static instance: ChangeStatusHomeViewPricingController
  private constructor() {
    super()
  }
  private ChangeStatusHomeViewPricingUseCase = new ChangeStatusHomeViewPricingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusHomeViewPricingController()
    }
    return this.instance
  }

  async changeStatusHomeViewPricing(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<HomeViewPricingModel> =
      await this.ChangeStatusHomeViewPricingUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: successImage,
        messageContent: null,
      })
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title! ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
