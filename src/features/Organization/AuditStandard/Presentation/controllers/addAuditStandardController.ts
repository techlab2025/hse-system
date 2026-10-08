import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddAuditStandardUseCase from '../../Domain/useCase/addAuditStandardUseCase'
import type AuditStandardModel from '../../Data/models/AuditStandardModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddAuditStandardExcelParams from '../../Core/params/addAuditStandardExcelParams'
import AddAuditStandardParams from '../../Core/params/addAuditStandardParams'

export default class AddAuditStandardController extends ControllerInterface<AuditStandardModel> {
  private static instance: AddAuditStandardController
  private constructor() {
    super()
  }
  private AddAuditStandardUseCase = new AddAuditStandardUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAuditStandardController()
    }
    return this.instance
  }

  async addAuditStandard(
    params: AddAuditStandardParams | AddAuditStandardExcelParams,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      if (params instanceof AddAuditStandardExcelParams) {
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
      const dataState: DataState<AuditStandardModel> =
        await this.AddAuditStandardUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: featureTranslation('added_successfully'),
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('audit-standard')) {
          const root = router.currentRoute.value.path.startsWith('/admin')
            ? '/admin'
            : '/organization'
          if (!draft) await router.push(`${root}/audit-standards`)
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
