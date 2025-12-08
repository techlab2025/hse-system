import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import EditOrganizatoinEmployeeUseCase from '../../Domain/useCase/editOrganizatoinEmployeeUseCase'
import type OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
import type EditOrganizatoinEmployeeParams from '../../Core/params/editOrganizatoinEmployeeParams'

export default class EditOrganizatoinEmployeeController extends ControllerInterface<OrganizatoinEmployeeModel> {
  private static instance: EditOrganizatoinEmployeeController

  private constructor() {
    super()
  }

  private EditOrganizatoinEmployeeUseCase = new EditOrganizatoinEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditOrganizatoinEmployeeController()
    }
    return this.instance
  }

  async editOrganizatoinEmployee(params: EditOrganizatoinEmployeeParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<OrganizatoinEmployeeModel> =
        await this.EditOrganizatoinEmployeeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/organization/organization-employee')
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
