import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type PPEToolModel from '../../Data/models/PPEToolModel'
import AddPPEToolCloneUseCase from '../../Domain/useCase/addPPEToolCloneUseCase'
import IndexPPEToolController from './indexPPEToolController'
import IndexPPEToolParams from '../../Core/params/indexPPEToolParams'
import AddPPEToolClonesParams from '../../Core/params/AddPPEToolClonesParams'

export default class AddPPEToolCloneController extends ControllerInterface<PPEToolModel> {
  private static instance: AddPPEToolCloneController
  private constructor() {
    super()
  }
  private addPPEToolCloneUseCase = new AddPPEToolCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPPEToolCloneController()
    }
    return this.instance
  }

  async addPPEToolClone(params: AddPPEToolClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<PPEToolModel> =
        await this.addPPEToolCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (router.currentRoute.value.path.includes('ppe-tool')) {
        //   if (!draft) await router.push('/organization/ppe-tool')
        // }

        // useLoaderStore().endLoadingWithDialog();
        await IndexPPEToolController.getInstance().getData(
          new IndexPPEToolParams('', 1, 10, 1),
        )
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
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
