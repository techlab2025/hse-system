import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteEmployeeUseCase from '../../Domain/useCase/deleteEmployeeUseCase'
import type EmployeeModel from '../../Data/models/equipmentModel'
import successImage from '@/assets/images/Success.png'

export default class DeleteEmployeeController extends ControllerInterface<EmployeeModel> {
  private static instance: DeleteEmployeeController
  private constructor() {
    super()
  }
  private deleteEmployeeUseCase = new DeleteEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEmployeeController()
    }
    return this.instance
  }

  async deleteEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<EmployeeModel> = await this.deleteEmployeeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'deleted was successful',
          imageElement: successImage,
          messageContent: null,
        })

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
