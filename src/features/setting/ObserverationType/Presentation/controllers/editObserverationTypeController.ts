import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import EditObserverationTypeUseCase from '@/features/setting/ObserverationType/Domain/useCase/editObserverationTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export default class EditObserverationTypeController extends ControllerInterface<ObserverationTypeModel> {
  private static instance: EditObserverationTypeController

  private constructor() {
    super()
  }

  private EditObserverationTypeUseCase = new EditObserverationTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditObserverationTypeController()
    }
    return this.instance
  }

  async editObserverationType(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ObserverationTypeModel> = await this.EditObserverationTypeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/Hazard-types`)
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
