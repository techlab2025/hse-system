import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type PTWTypeModel from '../../Data/models/PTWTypeModel'
import AddPTWTypeCloneUseCase from '../../Domain/useCase/addPTWTypeCloneUseCase'
import IndexPTWTypeController from './indexPTWTypeController'
import IndexPTWTypeParams from '../../Core/params/indexPTWTypeParams'
import AddPTWTypeClonesParams from '../../Core/params/AddPTWTypeClonesParams'

export default class AddPTWTypeCloneController extends ControllerInterface<PTWTypeModel> {
  private static instance: AddPTWTypeCloneController
  private constructor() {
    super()
  }
  private addPTWTypeCloneUseCase = new AddPTWTypeCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPTWTypeCloneController()
    }
    return this.instance
  }

  async addPTWTypeClone(params: AddPTWTypeClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<PTWTypeModel> =
        await this.addPTWTypeCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (router.currentRoute.value.path.includes('ptw-type')) {
        //   if (!draft) await router.push('/organization/ptw-type')
        // }

        // useLoaderStore().endLoadingWithDialog();
        await IndexPTWTypeController.getInstance().getData(
          new IndexPTWTypeParams('', 1, 10, 1),
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
