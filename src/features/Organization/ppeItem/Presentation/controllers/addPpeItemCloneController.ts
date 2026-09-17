import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type PpeItemModel from '../../Data/models/PpeItemModel'
import AddPpeItemCloneUseCase from '../../Domain/useCase/addPpeItemCloneUseCase'
import IndexPpeItemController from './indexPpeItemController'
import IndexPpeItemParams from '../../Core/params/indexPpeItemParams'
import AddPpeItemClonesParams from '../../Core/params/AddPpeItemClonesParams'

export default class AddPpeItemCloneController extends ControllerInterface<PpeItemModel> {
  private static instance: AddPpeItemCloneController
  private constructor() {
    super()
  }
  private addPpeItemCloneUseCase = new AddPpeItemCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPpeItemCloneController()
    }
    return this.instance
  }

  async addPpeItemClone(params: AddPpeItemClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<PpeItemModel> =
        await this.addPpeItemCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // useLoaderStore().endLoadingWithDialog();
        await IndexPpeItemController.getInstance().getData(
          new IndexPpeItemParams('', 1, 10, 1),
        )
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
