import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type ProjectModel from '../../Data/models/ProjectModel'
import CreateProjectZoonEquipmentUseCase from '../../../Domain/useCase/Equipments/CreateProjectZoonEquipmentUseCase'
import ProjectCustomLocationController from '../ProjectCustomLocationController'
import { ProjectCustomLocationEnum } from '../../../Core/Enums/ProjectCustomLocationEnum'
import ProjectCustomLocationParams from '../../../Core/params/ProjectCustomLocationParams'
import ShowProjectDetailsController from '../ShowProjectDetailsController'
import ShowProjectDetailsParams from '../../../Core/params/ShowProjectDetailsParams'

export default class CreateProjectZoneEquipmentsController extends ControllerInterface<ProjectModel> {
  private static instance: CreateProjectZoneEquipmentsController
  private constructor() {
    super()
  }
  private createProjectZoonEquipmentUseCase = new CreateProjectZoonEquipmentUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateProjectZoneEquipmentsController()
    }
    return this.instance
  }

  async CreateProjectZoneEquipment(
    params: Params,
    router: Router,
    projectId: number,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<ProjectModel> =
        await this.createProjectZoonEquipmentUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (!draft) await router.push(`/organization/project-equipment/project/${router.currentRoute.value.params.id}`)
        ProjectCustomLocationController.getInstance().FetchProjecuCustomLocation(
          new ProjectCustomLocationParams(projectId, [
            ProjectCustomLocationEnum.ZOON,
            ProjectCustomLocationEnum.ZOON_EQUIPMENT,
          ]),
        )

        console.log('detaile start')
        console.log(projectId )
        ShowProjectDetailsController.getInstance().showProjectDetails(
          new ShowProjectDetailsParams(projectId),
        )
        console.log('detaile end')
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
