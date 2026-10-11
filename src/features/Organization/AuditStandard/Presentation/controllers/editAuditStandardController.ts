import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type AuditStandardModel from '../../Data/models/AuditStandardModel'
import EditAuditStandardUseCase from '../../Domain/useCase/editAuditStandardUseCase'
import type { Router } from 'vue-router'

export default class EditAuditStandardController extends ControllerInterface<AuditStandardModel> {
  private static instance: EditAuditStandardController

  private constructor() {
    super()
  }

  private EditAuditStandardUseCase = new EditAuditStandardUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAuditStandardController()
    }
    return this.instance
  }

  async editAuditStandard(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AuditStandardModel> =
        await this.EditAuditStandardUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        const root = router.currentRoute.value.path.startsWith('/admin')
          ? '/admin'
          : '/organization'
        await router.push(`${root}/audit-standards`)
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? featureTranslation('error_occurred'),
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
