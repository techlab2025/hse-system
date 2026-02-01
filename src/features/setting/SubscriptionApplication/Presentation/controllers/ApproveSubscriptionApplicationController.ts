import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import ApproveSubscriptionApplicationUseCase from '../../Domain/useCase/ApproveSubscriptionApplicationUseCase'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type SubscriptionModel from '@/features/setting/Subscription/Data/models/SubscriptionModel'

export default class ApproveSubscriptionApplicationController extends ControllerInterface<SubscriptionModel> {
  private static instance: ApproveSubscriptionApplicationController
  private constructor() {
    super()
  }
  private addSubscriptionUseCase = new ApproveSubscriptionApplicationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ApproveSubscriptionApplicationController()
    }
    return this.instance
  }

  async approveSubscriptionApplication(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      console.log(params, 'params')
      const dataState: DataState<SubscriptionModel> = await this.addSubscriptionUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Approved was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()
        if (!draft) await router.push(`/admin/subscription-application`)

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
