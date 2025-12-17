import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type PartnerModel from '../../Data/models/PartnerModel'
import AddPartnerteUseCase from '../../Domain/useCase/addPartnerUseCase'
import type AddPartnerParams from '../../Core/params/addPartnerParams'

export default class AddPartnerController extends ControllerInterface<PartnerModel> {
  private static instance: AddPartnerController
  private constructor() {
    super()
  }
  private AddPartnerUseCase = new AddPartnerteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPartnerController()
    }
    return this.instance
  }

  async addPartner(params: AddPartnerParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate()?.isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<PartnerModel> = await this.AddPartnerUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push('/organizations/partner')

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
