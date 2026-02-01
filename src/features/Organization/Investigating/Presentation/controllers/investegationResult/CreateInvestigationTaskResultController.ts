import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type InvestegationResultModel from '../../../Data/models/investigationResult/InvestegationResulModel'
import CreateInvestigationTaskResultUseCase from '../../../Domain/useCase/investegationResult/CreateInvestigationTaskResultUseCase'
import ShowInvestigatingResultController from './ShowInvestigatingResultController'
import ShowInvestigationResultParams from '../../../Core/params/investegationResult/ShowInvestigationResultParams'

export default class CreateInvestigationTaskResultController extends ControllerInterface<InvestegationResultModel> {
  private static instance: CreateInvestigationTaskResultController
  private constructor() {
    super()
  }
  private createInvestigationTaskResultUseCase = new CreateInvestigationTaskResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateInvestigationTaskResultController()
    }
    return this.instance
  }

  async CreateInvestigationTaskResult(
    params: Params,
    router: Router,
    draft: boolean = false,
    route?: any,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log('Ssssssss')
      const dataState: DataState<InvestegationResultModel> =
        await this.createInvestigationTaskResultUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        // await router.push('/organization/investigating')
        // if (route) {

        // }
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
      await ShowInvestigatingResultController.getInstance().ShowInvestigatingResult(
        new ShowInvestigationResultParams(route.params.id),
        router,
      )
      location.reload()
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
