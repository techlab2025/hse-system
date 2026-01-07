import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type InspectionModel from '../../Data/models/InspectionModel'
import AddInspectionUseCase from '../../Domain/useCase/addInspectionUseCase'

export default class AddInspectionController extends ControllerInterface<InspectionModel> {
  private static instance: AddInspectionController
  private constructor() {
    super()
  }
  private AddInspectionUseCase = new AddInspectionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInspectionController()
    }
    return this.instance
  }

  async addInspection(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    console.log(params, 'params')

    try {
      const dataState: DataState<InspectionModel> = await this.AddInspectionUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        // if (!draft) await router.push(`/organization/equipment-mangement/inspection`)
        await router.push(`/organization/equipment-mangement/inspection?inspectionType=1`)

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
