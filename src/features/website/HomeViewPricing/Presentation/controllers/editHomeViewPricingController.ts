import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import EditHomeViewPricingUseCase from '../../Domain/useCase/editHomeViewPricingUseCase'





export default class EditHomeViewPricingController extends ControllerInterface<HomeViewPricingModel> {
  private static instance: EditHomeViewPricingController

  private constructor() {
    super()
  }

  private EditHomeViewPricingUseCase = new EditHomeViewPricingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHomeViewPricingController()
    }
    return this.instance
  }

  async editHomeViewPricing(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HomeViewPricingModel> = await this.EditHomeViewPricingUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/home-view-pricing')
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
