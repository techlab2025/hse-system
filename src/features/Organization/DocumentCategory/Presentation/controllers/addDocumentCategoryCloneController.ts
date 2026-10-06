import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type DocumentCategoryModel from '../../Data/models/DocumentCategoryModel'
import AddDocumentCategoryCloneUseCase from '../../Domain/useCase/addDocumentCategoryCloneUseCase'
import IndexDocumentCategoryController from './indexDocumentCategoryController'
import IndexDocumentCategoryParams from '../../Core/params/indexDocumentCategoryParams'
import AddDocumentCategoryClonesParams from '../../Core/params/AddDocumentCategoryClonesParams'

export default class AddDocumentCategoryCloneController extends ControllerInterface<DocumentCategoryModel> {
  private static instance: AddDocumentCategoryCloneController
  private constructor() {
    super()
  }
  private addDocumentCategoryCloneUseCase = new AddDocumentCategoryCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDocumentCategoryCloneController()
    }
    return this.instance
  }

  async addDocumentCategoryClone(params: AddDocumentCategoryClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<DocumentCategoryModel> =
        await this.addDocumentCategoryCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: featureTranslation('added_successfully'),
          imageElement: successImage,
          messageContent: null,
        })
        // if (router.currentRoute.value.path.includes('document-category')) {
        //   if (!draft) await router.push('/organization/document-category')
        // }

        // useLoaderStore().endLoadingWithDialog();
        await IndexDocumentCategoryController.getInstance().getData(
          new IndexDocumentCategoryParams('', 1, 10, 1),
        )
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
