import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type HazardModel from '../../Data/models/investigatingModel'
import CloseInvestigatingUseCase from '../../Domain/useCase/CloseInvestigatingUseCase'
import type { Router } from 'vue-router'

export default class CloseInvestegationController extends ControllerInterface<HazardModel> {
  private static instance: CloseInvestegationController
  private constructor() {
    super()
  }
  private closeInvestigatingUseCase = new CloseInvestigatingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CloseInvestegationController()
    }
    return this.instance
  }

  async CloseInvestigating(params: Params , router:Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HazardModel> = await this.closeInvestigatingUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
        console.log('success')
      } else {
        console.log('error')

        throw new Error('Error while addServices')
      }
        await router.push('/organization/investigating')

    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
