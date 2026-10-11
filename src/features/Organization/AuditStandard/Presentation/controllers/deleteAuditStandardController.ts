import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type AuditStandardModel from '../../Data/models/AuditStandardModel'
import DeleteAuditStandardUseCase from '../../Domain/useCase/deleteAuditStandardUseCase'

export default class DeleteAuditStandardController extends ControllerInterface<AuditStandardModel> {
  private static instance: DeleteAuditStandardController
  private constructor() {
    super()
  }
  private DeleteAuditStandardUseCase = new DeleteAuditStandardUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAuditStandardController()
    }
    return this.instance
  }

  async deleteAuditStandard(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AuditStandardModel> =
        await this.DeleteAuditStandardUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      const errorMessage =
        this.state.value.error?.title ??
        this.state.value.message ??
        error?.message ??
        'An Error Occurred'
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: 'An Error Occurred',
        imageElement: errorImage,
        messageContent: errorMessage,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
