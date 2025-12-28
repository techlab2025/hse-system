import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type WhereHouseModel from '../../Data/models/WhereHouseModel'
import EditWhereHouseUseCase from '../../Domain/useCase/editWhereHouseUseCase'


export default class EditWhereHouseController extends ControllerInterface<WhereHouseModel> {
  private static instance: EditWhereHouseController

  private constructor() {
    super()
  }

  private EditWhereHouseUseCase = new EditWhereHouseUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditWhereHouseController()
    }
    return this.instance
  }

  async editWhereHouse(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<WhereHouseModel> = await this.EditWhereHouseUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/organization/where-house')
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
