import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type InvestegationResultModel from '../../../Data/models/investigationResult/InvestegationResulModel'
import IndexInvestigatingResultUseCase from '../../../Domain/useCase/investegationResult/indexInvestigatingResultUseCase'

export default class IndexInvestigatingResultController extends ControllerInterface<
  InvestegationResultModel[]
> {
  private static instance: IndexInvestigatingResultController
  private constructor() {
    super()
  }
  private indexInvestigatingResultUseCase = new IndexInvestigatingResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInvestigatingResultController()
    }
    return this.instance
  }

  async IndexInvestigatingResult(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log('Ssssssss')
      const dataState: DataState<InvestegationResultModel[]> =
        await this.indexInvestigatingResultUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: 'Added was successful',
        //   imageElement: successImage,
        //   messageContent: null,
        // })
      } else {
        // DialogSelector.instance.failedDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
        //   imageElement: errorImage,
        //   messageContent: null,
        // })
      }
    } catch (error: unknown) {
      // DialogSelector.instance.failedDialog.openDialog({
      //   dialogName: 'dialog',
      //   titleContent: this.state.value.error?.title ?? (error as string),
      //   imageElement: errorImage,
      //   messageContent: null,
      // })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
