import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { Observation } from '../../../Core/Enums/ObservationTypeEnum'
import AddInvestigatingResultUseCase from '../../../Domain/useCase/investegationResult/addInvestigatingResultUseCase'
import type InvestigatingModel from '../../../Data/models/investigatingModel'

export default class AddInvestigatingResultController extends ControllerInterface<InvestigatingModel> {
  private static instance: AddInvestigatingResultController
  private constructor() {
    super()
  }
  private addInvestigatingResultUseCase = new AddInvestigatingResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInvestigatingResultController()
    }
    return this.instance
  }

  async addInvestigatingResult(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log('Ssssssss')
      const dataState: DataState<InvestigatingModel> =
        await this.addInvestigatingResultUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/organization/investigating')
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
