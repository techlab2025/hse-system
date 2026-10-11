import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router'
import type HierarchyEmployeeModel from '@/features/Organization/Project/Data/models/LocationHierarchyEmployeeModel'
import AddHierarchyEmployeeUseCase from '@/features/Organization/Project/Domain/useCase/Hierarchy/HierarchyEmployee/addHierarchyEmployeeUserCase'
import ProjectCustomLocationController from '../../ProjectCustomLocationController'
import ProjectCustomLocationParams from '@/features/Organization/Project/Core/params/ProjectCustomLocationParams'
import { ProjectCustomLocationEnum } from '@/features/Organization/Project/Core/Enums/ProjectCustomLocationEnum'

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

  async addHierarchyEmployee(
    params: Params,
    router: Router,
    route: RouteLocationNormalizedLoaded,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<HierarchyEmployeeModel> =
        await this.AddHierarchyEmployeeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (route.path.includes('project-employee')) {
          const projectId = Number(route.params?.project_id || route.params?.id)
          await router.push(
            route.query?.return_to === 'summary'
              ? `/organization/project-summary/${projectId}`
              : `/organization/employee-details/${projectId}`,
          )
        }
        await ProjectCustomLocationController.getInstance().getData(
          new ProjectCustomLocationParams(
            Number(route.params?.project_id || route.params?.id),
            [
              ProjectCustomLocationEnum.EMPLOYEE,
              ProjectCustomLocationEnum.HIERARCHY,
              ProjectCustomLocationEnum.HIERARCHY_EMPLOYEE,
            ],
          ),
        )

        // useLoaderStore().endLoadingWithDialog();
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
