import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddAuditActivityUseCase from '../../Domain/useCase/addAuditActivityUseCase'
import type AuditActivityModel from '../../Data/models/AuditActivityModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddAuditActivityExcelParams from '../../Core/params/addAuditActivityExcelParams'
import AddAuditActivityParams from '../../Core/params/addAuditActivityParams'

export default class AddAuditActivityController extends ControllerInterface<AuditActivityModel> {
  private static instance: AddAuditActivityController
  private constructor() {
    super()
  }
  private AddAuditActivityUseCase = new AddAuditActivityUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAuditActivityController()
    }
    return this.instance
  }

  async addAuditActivity(
    params: AddAuditActivityParams | AddAuditActivityExcelParams,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      if (params instanceof AddAuditActivityExcelParams) {
        if (!params.data.length) {
          new OpenWarningDilaog(featureTranslation('excel_row_required')).openDialog()
          return
        }
        for (const el of params.data) {
          if (!el.title) {
            new OpenWarningDilaog(featureTranslation('title_required')).openDialog()
            return
          }
        }
      } else {
        params.validate()
        if (!params.validate().isValid) {
          params.validateOrThrow()
          return
        }
      }
      const dataState: DataState<AuditActivityModel> =
        await this.AddAuditActivityUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: featureTranslation('added_successfully'),
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('audit-activity')) {
          const root = router.currentRoute.value.path.startsWith('/admin')
            ? '/admin'
            : '/organization'
          if (!draft) await router.push(`${root}/audit-activities`)
        }

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? featureTranslation('error_occurred'),
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
