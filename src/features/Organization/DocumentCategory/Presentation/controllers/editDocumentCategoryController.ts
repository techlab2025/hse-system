import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'
import EditDocumentCategoryUseCase from '../../Domain/useCase/editDocumentCategoryUseCase'
import type { Router } from 'vue-router'

export default class EditDocumentCategoryController extends ControllerInterface<DocumentCategoryModel> {
  private static instance: EditDocumentCategoryController

  private constructor() {
    super()
  }

  private EditDocumentCategoryUseCase = new EditDocumentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditDocumentCategoryController()
    }
    return this.instance
  }

  async editDocumentCategory(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<DocumentCategoryModel> =
        await this.EditDocumentCategoryUseCase.call(params)
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
        await router.push(`${root}/document-categories`)
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
