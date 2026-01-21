import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import AddProjectZoneUseCase from '../../Domain/useCase/addProjectZoneUseCase'

export default class AddProjectZoneController extends ControllerInterface<ProjectZoneModel> {
  private static instance: AddProjectZoneController
  private constructor() {
    super()
  }
  private AddProjectZoneUseCase = new AddProjectZoneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddProjectZoneController()
    }
    return this.instance
  }

  async addProjectZone(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log("Ssssssss")
      const dataState: DataState<ProjectZoneModel> = await this.AddProjectZoneUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (router?.currentRoute?.value?.path.includes('project-zone')) {
          if (!draft) await router.push('/organization/project-zone')
        }

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
