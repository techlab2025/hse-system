import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type PpeItemModel from '../../Data/models/MangementChangeTopicTypeModel'
import DeletePpeItemUseCase from '../../Domain/useCase/deleteMangementChangeTopicTypeUseCase'
import type MangementChangeTopicTypeModel from '../../Data/models/MangementChangeTopicTypeModel'
import DeleteMangementChangeTopicTypeUseCase from '../../Domain/useCase/deleteMangementChangeTopicTypeUseCase'

export default class DeleteMangementChangeTopicTypeController extends ControllerInterface<MangementChangeTopicTypeModel> {
  private static instance: DeleteMangementChangeTopicTypeController
  private constructor() {
    super()
  }
  private DeleteMangementChangeTopicTypeUseCase = new DeleteMangementChangeTopicTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteMangementChangeTopicTypeController()
    }
    return this.instance
  }

  async deleteMangementChangeTopicType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<MangementChangeTopicTypeModel> =
        await this.DeleteMangementChangeTopicTypeUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while deleting management change topic type')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
