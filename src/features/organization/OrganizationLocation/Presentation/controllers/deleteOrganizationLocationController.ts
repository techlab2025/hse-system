import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import DeleteOrganizationLocationUseCase from '../../Domain/useCase/deleteOrganizationLocationUseCase'

export default class DeleteOrganizationLocationController extends ControllerInterface<OrganizationLocationModel> {
  private static instance: DeleteOrganizationLocationController
  private constructor() {
    super()
  }
  private DeleteOrganizationLocationUseCase = new DeleteOrganizationLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteOrganizationLocationController()
    }
    return this.instance
  }

  async deleteOrganizationLocation(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<OrganizationLocationModel> =
        await this.DeleteOrganizationLocationUseCase.call(params)

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
