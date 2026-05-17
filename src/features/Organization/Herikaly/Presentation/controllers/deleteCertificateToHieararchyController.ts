import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type HerikalyModel from '../../Data/models/HerikalyModel'
import DeleteCertificateToHierarchyUseCase from '../../Domain/useCase/deleteCertificateToHierarchyUseCase'

export default class DeleteCErtificateToHierarachyController extends ControllerInterface<HerikalyModel> {
  private static instance: DeleteCErtificateToHierarachyController
  private constructor() {
    super()
  }
  private deleteCertificateToHierarchyUseCase = new DeleteCertificateToHierarchyUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteCErtificateToHierarachyController()
    }
    return this.instance
  }

  async deleteCertificateToHieararchy(params: Params, router: Router, draft: boolean = false) {
    try {
      const dataState: DataState<HerikalyModel> =
        await this.deleteCertificateToHierarchyUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'deleted was successful',
          imageElement: successImage,
          messageContent: null,
        })
      } else {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'deleted was successful',
          imageElement: successImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      // DialogSelector.instance.failedDialog.openDialog({
      //   dialogName: 'dialog-error',
      //   titleContent: this.state.value.error?.title ?? (error as string),
      //   imageElement: errorImage,
      //   messageContent: null,
      // })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
