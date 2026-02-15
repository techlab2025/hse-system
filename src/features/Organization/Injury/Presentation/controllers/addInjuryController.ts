import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type InjuryModel from '../../Data/models/InjuryModel'
import AddInjuryteUseCase from '../../Domain/useCase/addInjuryUseCase'
import type AddInjuryParams from '../../Core/params/addInjuryParams'

export default class AddInjuryController extends ControllerInterface<InjuryModel> {
  private static instance: AddInjuryController
  private constructor() {
    super()
  }
  private AddInjuryUseCase = new AddInjuryteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInjuryController()
    }
    return this.instance
  }

  async addInjury(params: AddInjuryParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate()?.isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<InjuryModel> = await this.AddInjuryUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        if (router.currentRoute.value.path.includes('injury')) {
          if (!draft) await router.push('/organization/injury')
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
