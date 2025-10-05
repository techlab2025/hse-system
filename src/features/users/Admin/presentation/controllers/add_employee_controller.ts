import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import EmployeeModel from '@/features/users/Admin/Data/models/index_employee_model'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import AddEmployeeUseCase from '@/features/users/Admin/Domain/useCase/add_employee_use_case'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class AddEmployeeController extends ControllerInterface<EmployeeModel> {
  private static instance: AddEmployeeController
  private constructor() {
    super()
  }
  private AddEmployeeUseCase = new AddEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddEmployeeController()
    }
    return this.instance
  }

  async addEmployee(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<EmployeeModel> = await this.AddEmployeeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        // console.log(this.state.value.data)
        // console.log(draft)
        if (!draft) await router.push('/users/employees')

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
        // throw new Error(this.state.value.error?.title)
      }
    } catch (error: any) {
      console.log(this.state.value.message)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        // titleContent: 'adssddsasdadsa',
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
