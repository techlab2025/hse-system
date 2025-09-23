import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type OrganizationModel from '../../Data/models/OrganizationModel'
import DeleteOrganizationUseCase from '../../Domain/useCase/deleteOrganizationUseCase'

export default class DeleteOrganizationController extends ControllerInterface<OrganizationModel> {
  private static instance: DeleteOrganizationController
  private constructor() {
    super()
  }
  private deleteOrganizationUseCase = new DeleteOrganizationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationController()
    }
    return this.instance
  }

  async deleteOrganization(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<OrganizationModel> =
        await this.deleteOrganizationUseCase.call(params)

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
