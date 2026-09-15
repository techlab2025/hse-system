import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type MangementChangeTopicTypeModel from '../../Data/models/MangementChangeTopicTypeModel'
import type AddMangementChangeTopicTypeClonesParams from '../../Core/params/AddMangementChangeTopicTypeParams'
import AddManagementChangeTopicTypeCloneUseCase from '../../Domain/useCase/addManagementChangeTopicTypeCloneUseCase'
import IndexMangementChangeTopicTypeParams from '../../Core/params/indexMangementChangeTopicTypeParams'
import IndexMangementChangeTopicTypeController from './indexMangementChangeTopicTypeController'

export default class AddMangementChangeTopicCloneController extends ControllerInterface<MangementChangeTopicTypeModel> {
  private static instance: AddMangementChangeTopicCloneController
  private constructor() {
    super()
  }
  private addMangementChangeTopicTypeCloneUseCase = new AddManagementChangeTopicTypeCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMangementChangeTopicCloneController()
    }
    return this.instance
  }

  async addMangementChangeTopicTypeClone(params: AddMangementChangeTopicTypeClonesParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<MangementChangeTopicTypeModel> =
        await this.addMangementChangeTopicTypeCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // useLoaderStore().endLoadingWithDialog();
        await IndexMangementChangeTopicTypeController.getInstance().getData(
          new IndexMangementChangeTopicTypeParams('', 1, 10, 1),
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
