import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type DrillTypeModel from '../../Data/models/DrillTypeModel'
import AddDrillTypeCloneUseCase from '../../Domain/useCase/addDrillTypeCloneUseCase'
import IndexDrillTypeController from './indexDrillTypeController'
import IndexDrillTypeParams from '../../Core/params/indexDrillTypeParams'
import AddDrillTypeClonesParams from '../../Core/params/AddDrillTypeClonesParams'

export default class AddDrillTypeCloneController extends ControllerInterface<DrillTypeModel> {
  private static instance: AddDrillTypeCloneController
  private constructor() {
    super()
  }
  private addDrillTypeCloneUseCase = new AddDrillTypeCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDrillTypeCloneController()
    }
    return this.instance
  }

  async addDrillTypeClone(params: AddDrillTypeClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<DrillTypeModel> =
        await this.addDrillTypeCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (router.currentRoute.value.path.includes('drill-type')) {
        //   if (!draft) await router.push('/organization/drill-type')
        // }

        // useLoaderStore().endLoadingWithDialog();
        await IndexDrillTypeController.getInstance().getData(
          new IndexDrillTypeParams('', 1, 10, 1),
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
