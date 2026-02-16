import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'
import EditWhereHouseTypeUseCase from '../../Domain/useCase/editWhereHouseTypeUseCase'

export default class EditWhereHouseTypeController extends ControllerInterface<WhereHouseTypeModel> {
  private static instance: EditWhereHouseTypeController

  private constructor() {
    super()
  }

  private EditWhereHouseTypeUseCase = new EditWhereHouseTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditWhereHouseTypeController()
    }
    return this.instance
  }

  async editWhereHouseType(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<WhereHouseTypeModel> =
        await this.EditWhereHouseTypeUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/organization/where-house-type')
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
