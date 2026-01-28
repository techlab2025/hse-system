import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteSubscriptionUseCase from '../../Domain/useCase/deleteSubscriptionApplicationUseCase'
import successImage from '@/assets/images/Success.png'
import type SubscriptionModel from '../../Data/models/SubscriptionModel'

export default class DeleteSubscriptionController extends ControllerInterface<SubscriptionModel> {
  private static instance: DeleteSubscriptionController
  private constructor() {
    super()
  }
  private deleteSubscriptionUseCase = new DeleteSubscriptionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteSubscriptionController()
    }
    return this.instance
  }

  async deleteSubscription(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SubscriptionModel> = await this.deleteSubscriptionUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'deleted was successful',
          imageElement: successImage,
          messageContent: null,
        })

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
