import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type ProjectPermitsModel from '../../../Data/models/PermitToWork/ProjectPermitsModel'
import FetchMyProjectPermitsUseCase from '../../../Domain/useCase/PermitToWork/FetchMyProjectPermitsUseCase'
import type PermitStaticsModel from '../../../Data/models/PermitToWork/PermitStaticsModel'
import PermitStaticsToWorkResultUseCase from '../../../Domain/useCase/PermitToWork/PermitStaticsToWorkResultUseCase'

export default class FetchStaticsPermitsController extends ControllerInterface<
  PermitStaticsModel
> {
  private static instance: FetchStaticsPermitsController
  private constructor() {
    super()
  }
  private permitStaticsToWorkResultUseCase = new PermitStaticsToWorkResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchStaticsPermitsController()
    }
    return this.instance
  }

  async FetchMyProjectPermits(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<PermitStaticsModel> =
        await this.permitStaticsToWorkResultUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: 'dialog-success',
        //   titleContent: 'Added was successful',
        //   imageElement: successImage,
        //   messageContent: null,
        // })
        // if (!draft) await router.push('/organization/project-details')
        // router.push(`/organization/project-details/${router.currentRoute.value.params.project_id}`)
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
