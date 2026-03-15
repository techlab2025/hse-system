import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type CheckListDetailsModel from '../../Data/models/CheckListModel'
import DeleteCheckListUseCase from '../../Domain/useCase/deleteCheckListUseCase'

export default class DeleteCheckListController extends ControllerInterface<CheckListDetailsModel> {
  private static instance: DeleteCheckListController
  private constructor() {
    super()
  }
  private DeleteCheckListUseCase = new DeleteCheckListUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCheckListController()
    }
    return this.instance
  }

  async deleteCheckList(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<CheckListDetailsModel> =
        await this.DeleteCheckListUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
