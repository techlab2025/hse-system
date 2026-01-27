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
import ShowProjectDetailsController from '../../ShowProjectDetailsController'
import ShowProjectDetailsParams from '@/features/Organization/Project/Core/params/ShowProjectDetailsParams'

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

  async addHierarchyEmployee(params: Params, router: Router, route: any) {
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
        if (route.path.includes('project-employee')) {
          await router.push(
            `/organization/employee-details/${route.params?.project_id || route.params?.id}`,
          )
        }
        await ShowProjectDetailsController.getInstance().showProjectDetails(
          new ShowProjectDetailsParams(Number(route.params?.project_id || route.params?.id)),
        )

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
