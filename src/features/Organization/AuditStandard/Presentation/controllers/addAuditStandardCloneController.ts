import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type AuditStandardModel from '../../Data/models/AuditStandardModel'
import AddAuditStandardCloneUseCase from '../../Domain/useCase/addAuditStandardCloneUseCase'
import IndexAuditStandardController from './indexAuditStandardController'
import IndexAuditStandardParams from '../../Core/params/indexAuditStandardParams'
import AddAuditStandardClonesParams from '../../Core/params/AddAuditStandardClonesParams'

export default class AddAuditStandardCloneController extends ControllerInterface<AuditStandardModel> {
  private static instance: AddAuditStandardCloneController
  private constructor() {
    super()
  }
  private addAuditStandardCloneUseCase = new AddAuditStandardCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAuditStandardCloneController()
    }
    return this.instance
  }

  async addAuditStandardClone(params: AddAuditStandardClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<AuditStandardModel> =
        await this.addAuditStandardCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: featureTranslation('added_successfully'),
          imageElement: successImage,
          messageContent: null,
        })
        // if (router.currentRoute.value.path.includes('audit-standard')) {
        //   if (!draft) await router.push('/organization/audit-standard')
        // }

        // useLoaderStore().endLoadingWithDialog();
        await IndexAuditStandardController.getInstance().getData(
          new IndexAuditStandardParams('', 1, 10, 1),
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
