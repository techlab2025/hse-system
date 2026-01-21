import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type ProjectModel from '../../Data/models/ProjectModel'
import CreateProjectZoonUseCase from '../../Domain/useCase/CraeteProjectZoonUseCase'
import ShowProjectDetailsController from './ShowProjectDetailsController'
import ShowProjectDetailsParams from '../../Core/params/ShowProjectDetailsParams'

export default class CreateProjectZoonController extends ControllerInterface<ProjectModel> {
  private static instance: CreateProjectZoonController
  private constructor() {
    super()
  }
  private createProjectZoonUseCase = new CreateProjectZoonUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateProjectZoonController()
    }
    return this.instance
  }

  async CreateProjectZoon(params: Params, route: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<ProjectModel> = await this.createProjectZoonUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (!draft) await router.push('/organization/project-details')
        // if (!draft) await router.push('/organization/projects')

        // useLoaderStore().endLoadingWithDialog();
        await ShowProjectDetailsController.getInstance().showProjectDetails(
          new ShowProjectDetailsParams(Number(route.params?.id)),
        )
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
