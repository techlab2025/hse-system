import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'
import DeleteWhereHouseTypeUseCase from '../../Domain/useCase/deleteWhereHouseTypeUseCase'

export default class DeleteWhereHouseTypeController extends ControllerInterface<WhereHouseTypeModel> {
  private static instance: DeleteWhereHouseTypeController
  private constructor() {
    super()
  }
  private DeleteWhereHouseTypeUseCase = new DeleteWhereHouseTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteWhereHouseTypeController()
    }
    return this.instance
  }

  async deleteWhereHouseType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<WhereHouseTypeModel> =
        await this.DeleteWhereHouseTypeUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
