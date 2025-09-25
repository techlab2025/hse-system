import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type HomeViewPricingModel from '../../Data/models/HomeViewPricingModel'
import DeleteHomeViewPricingUseCase from '../../Domain/useCase/deleteHomeViewPricingUseCase'





export default class DeleteHomeViewPricingController extends ControllerInterface<HomeViewPricingModel> {
  private static instance: DeleteHomeViewPricingController
  private constructor() {
    super()
  }
  private DeleteHomeViewPricingUseCase = new DeleteHomeViewPricingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteHomeViewPricingController()
    }
    return this.instance
  }

  async deleteHomeViewPricing(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HomeViewPricingModel> =
        await this.DeleteHomeViewPricingUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
