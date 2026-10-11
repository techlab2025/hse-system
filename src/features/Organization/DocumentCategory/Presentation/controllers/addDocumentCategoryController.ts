import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddDocumentCategoryUseCase from '../../Domain/useCase/addDocumentCategoryUseCase'
import type DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddDocumentCategoryExcelParams from '../../Core/params/addDocumentCategoryExcelParams'
import AddDocumentCategoryParams from '../../Core/params/addDocumentCategoryParams'

export default class AddDocumentCategoryController extends ControllerInterface<DocumentCategoryModel> {
  private static instance: AddDocumentCategoryController
  private constructor() {
    super()
  }
  private AddDocumentCategoryUseCase = new AddDocumentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDocumentCategoryController()
    }
    return this.instance
  }

  async addDocumentCategory(
    params: AddDocumentCategoryParams | AddDocumentCategoryExcelParams,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      if (params instanceof AddDocumentCategoryExcelParams) {
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
      const dataState: DataState<DocumentCategoryModel> =
        await this.AddDocumentCategoryUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: featureTranslation('added_successfully'),
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('document-category')) {
          const root = router.currentRoute.value.path.startsWith('/admin')
            ? '/admin'
            : '/organization'
          if (!draft) await router.push(`${root}/document-categories`)
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
