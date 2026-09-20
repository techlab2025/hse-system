import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type PermitAuditResultModel from '../../../Data/models/PermitToWork/PermitAuditResultModel'
import FetchProjectPermitsAuditsUseCase from '../../../Domain/useCase/PermitToWork/FetchProjectPermitsAuditsUseCase'

export default class FetchProjectPermitsAuditsController extends ControllerInterface<
  PermitAuditResultModel[]
> {
  private static instance: FetchProjectPermitsAuditsController
  private constructor() {
    super()
  }
  private fetchProjectPermitsAuditsUseCase = new FetchProjectPermitsAuditsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectPermitsAuditsController()
    }
    return this.instance
  }

  // , router: Router, draft: boolean = false
  async FetchProjectPermitsAudits(params: Params) {
    this.setLoading()
    try {
      const dataState: DataState<PermitAuditResultModel[]> =
        await this.fetchProjectPermitsAuditsUseCase.call(params)
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
