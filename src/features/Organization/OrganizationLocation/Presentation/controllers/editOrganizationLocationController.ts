import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import EditOrganizationLocationUseCase from '../../Domain/useCase/editOrganizationLocationUseCase'

export default class EditOrganizationLocationController extends ControllerInterface<OrganizationLocationModel> {
  private static instance: EditOrganizationLocationController

  private constructor() {
    super()
  }

  private EditOrganizationLocationUseCase = new EditOrganizationLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditOrganizationLocationController()
    }
    return this.instance
  }

  async editOrganizationLocation(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<OrganizationLocationModel> = await this.EditOrganizationLocationUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/organization/organization-locations')
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
