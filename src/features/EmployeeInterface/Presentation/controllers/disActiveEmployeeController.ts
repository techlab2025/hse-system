import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type EmployeeModel from '../../Data/models/equipmentModel'
import DisEmployeeUseCase from '../../Domain/useCase/disEmployeeUseCase'

export default class disActiveEmployeeController extends ControllerInterface<EmployeeModel> {
  private static instance: disActiveEmployeeController
  private constructor() {
    super()
  }
  private disEmployeeUseCase = new DisEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveEmployeeController()
    }
    return this.instance
  }

  async disActiveEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<EmployeeModel> = await this.disEmployeeUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: successImage,
        messageContent: null,
      })
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title! ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
