import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteOrganizatoinEmployeeUseCase from '../../Domain/useCase/deleteOrganizatoinEmployeeUseCase'
import type OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'

export default class DeleteOrganizatoinEmployeeController extends ControllerInterface<OrganizatoinEmployeeModel> {
  private static instance: DeleteOrganizatoinEmployeeController
  private constructor() {
    super()
  }
  private DeleteOrganizatoinEmployeeUseCase = new DeleteOrganizatoinEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizatoinEmployeeController()
    }
    return this.instance
  }

  async deleteOrganizatoinEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<OrganizatoinEmployeeModel> =
        await this.DeleteOrganizatoinEmployeeUseCase.call(params)

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
