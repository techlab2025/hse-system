import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import EditHealthConditionsUseCase from '@/features/setting/HealthConditions/Domain/useCase/editHealthConditionsUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'

export default class EditHealthConditionsController extends ControllerInterface<HealthConditionsModel> {
  private static instance: EditHealthConditionsController

  private constructor() {
    super()
  }

  private EditHealthConditionsUseCase = new EditHealthConditionsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHealthConditionsController()
    }
    return this.instance
  }

  async editHealthConditions(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HealthConditionsModel> = await this.EditHealthConditionsUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/health-conditions`)
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
