import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import successImage from '@/assets/images/Success.png'
import type SubscriptionModel from '@/features/setting/Subscription/Data/models/SubscriptionModel'
import RejectSubscriptionApplicationUseCase from '../../Domain/useCase/RejectSubscriptionApplicationUseCase'
import type { Router } from 'vue-router'

export default class RejectSubscriptionApplicationController extends ControllerInterface<SubscriptionModel> {
  private static instance: RejectSubscriptionApplicationController
  private constructor() {
    super()
  }
  private rejectSubscriptionApplicationUseCase = new RejectSubscriptionApplicationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new RejectSubscriptionApplicationController()
    }
    return this.instance
  }

  async rejectSubscriptionApplication(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SubscriptionModel> =
        await this.rejectSubscriptionApplicationUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Rejected',
          imageElement: successImage,
          messageContent: null,
        })
        await router.push(`/admin/subscription-application`)

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
