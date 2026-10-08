import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type AuditActivityModel from '../../Data/models/AuditActivityModel'
import AddAuditActivityCloneUseCase from '../../Domain/useCase/addAuditActivityCloneUseCase'
import IndexAuditActivityController from './indexAuditActivityController'
import IndexAuditActivityParams from '../../Core/params/indexAuditActivityParams'
import AddAuditActivityClonesParams from '../../Core/params/AddAuditActivityClonesParams'

export default class AddAuditActivityCloneController extends ControllerInterface<AuditActivityModel> {
  private static instance: AddAuditActivityCloneController
  private constructor() {
    super()
  }
  private addAuditActivityCloneUseCase = new AddAuditActivityCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAuditActivityCloneController()
    }
    return this.instance
  }

  async addAuditActivityClone(params: AddAuditActivityClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<AuditActivityModel> =
        await this.addAuditActivityCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: featureTranslation('added_successfully'),
          imageElement: successImage,
          messageContent: null,
        })
        // if (router.currentRoute.value.path.includes('audit-activity')) {
        //   if (!draft) await router.push('/organization/audit-activity')
        // }

        // useLoaderStore().endLoadingWithDialog();
        await IndexAuditActivityController.getInstance().getData(
          new IndexAuditActivityParams('', 1, 10, 1),
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
