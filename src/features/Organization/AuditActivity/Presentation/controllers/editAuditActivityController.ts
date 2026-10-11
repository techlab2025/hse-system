import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type AuditActivityModel from '../../Data/models/AuditActivityModel'
import EditAuditActivityUseCase from '../../Domain/useCase/editAuditActivityUseCase'
import type { Router } from 'vue-router'

export default class EditAuditActivityController extends ControllerInterface<AuditActivityModel> {
  private static instance: EditAuditActivityController

  private constructor() {
    super()
  }

  private EditAuditActivityUseCase = new EditAuditActivityUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAuditActivityController()
    }
    return this.instance
  }

  async editAuditActivity(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AuditActivityModel> =
        await this.EditAuditActivityUseCase.call(params)
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
        await router.push(`${root}/audit-activities`)
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
