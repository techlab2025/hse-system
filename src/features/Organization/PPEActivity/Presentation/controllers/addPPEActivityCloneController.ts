import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type PPEActivityModel from '../../Data/models/PPEActivityModel'
import AddPPEActivityCloneUseCase from '../../Domain/useCase/addPPEActivityCloneUseCase'
import IndexPPEActivityController from './indexPPEActivityController'
import IndexPPEActivityParams from '../../Core/params/indexPPEActivityParams'
import AddPPEActivityClonesParams from '../../Core/params/AddPPEActivityClonesParams'

export default class AddPPEActivityCloneController extends ControllerInterface<PPEActivityModel> {
  private static instance: AddPPEActivityCloneController
  private constructor() {
    super()
  }
  private addPPEActivityCloneUseCase = new AddPPEActivityCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPPEActivityCloneController()
    }
    return this.instance
  }

  async addPPEActivityClone(params: AddPPEActivityClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<PPEActivityModel> =
        await this.addPPEActivityCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: featureTranslation('added_successfully'),
          imageElement: successImage,
          messageContent: null,
        })
        // if (router.currentRoute.value.path.includes('ppe-activity')) {
        //   if (!draft) await router.push('/organization/ppe-activity')
        // }

        // useLoaderStore().endLoadingWithDialog();
        await IndexPPEActivityController.getInstance().getData(
          new IndexPPEActivityParams('', 1, 10, 1),
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
