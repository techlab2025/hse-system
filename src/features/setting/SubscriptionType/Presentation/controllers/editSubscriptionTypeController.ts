import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import EditSubscriptionTypeUseCase from '../../Domain/useCase/editSubscriptionTypeUseCase'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import type SubscriptionTypeModel from '../../Data/models/SubscriptionTypeModel'

export default class EditSubscriptionTypeController extends ControllerInterface<SubscriptionTypeModel> {
  private static instance: EditSubscriptionTypeController

  private constructor() {
    super()
  }

  private editSubscriptionTypeUseCase = new EditSubscriptionTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditSubscriptionTypeController()
    }
    return this.instance
  }

  async editSubscriptionType(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<SubscriptionTypeModel> =
        await this.editSubscriptionTypeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        await router.push(`/admin/subscription-types`)
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
