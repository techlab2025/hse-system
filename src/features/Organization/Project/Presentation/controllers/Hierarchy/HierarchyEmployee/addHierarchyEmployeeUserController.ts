import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type HierarchyEmployeeModel from '@/features/Organization/Project/Data/models/LocationHierarchyEmployeeModel'
import AddHierarchyEmployeeUseCase from '@/features/Organization/Project/Domain/useCase/Hierarchy/HierarchyEmployee/addHierarchyEmployeeUserCase'



export default class AddHierarchyEmployeeController extends ControllerInterface<HierarchyEmployeeModel> {
  private static instance: AddHierarchyEmployeeController
  private constructor() {
    super()
  }
  private AddHierarchyEmployeeUseCase = new AddHierarchyEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddHierarchyEmployeeController()
    }
    return this.instance
  }

  async addHierarchyEmployee(params: Params, router: Router,) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<HierarchyEmployeeModel> =
        await this.AddHierarchyEmployeeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        await router.push(`/organization/employee-details/${params?.projectId}`)

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
