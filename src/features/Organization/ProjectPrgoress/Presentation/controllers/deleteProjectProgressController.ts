import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type PartnerModel from '../../Data/models/PartnerModel'
import DeletePartnerUseCase from '../../Domain/useCase/deletePartnerUseCase'

export default class DeletePartnerController extends ControllerInterface<PartnerModel> {
  private static instance: DeletePartnerController
  private constructor() {
    super()
  }
  private DeletePartnerUseCase = new DeletePartnerUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeletePartnerController()
    }
    return this.instance
  }

  async deletePartner(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<PartnerModel> =
        await this.DeletePartnerUseCase.call(params)

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
