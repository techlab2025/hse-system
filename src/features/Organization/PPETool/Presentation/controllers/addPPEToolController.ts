import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddPPEToolUseCase from '../../Domain/useCase/addPPEToolUseCase'
import type PPEToolModel from '../../Data/models/PPEToolModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddPPEToolExcelParams from '../../Core/params/addPPEToolExcelParams'
import AddPPEToolParams from '../../Core/params/addPPEToolParams'

export default class AddPPEToolController extends ControllerInterface<PPEToolModel> {
  private static instance: AddPPEToolController
  private constructor() {
    super()
  }
  private AddPPEToolUseCase = new AddPPEToolUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPPEToolController()
    }
    return this.instance
  }

  async addPPETool(
    params: AddPPEToolParams | AddPPEToolExcelParams,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      if (params instanceof AddPPEToolExcelParams) {
        if (!params.data.length) {
          new OpenWarningDilaog('At least one row is required').openDialog()
          return
        }
        for (const el of params.data) {
          if (!el.title) {
            new OpenWarningDilaog('Title is required').openDialog()
            return
          }
        }
      } else {
        params.validate()
        if (!params.validate().isValid) {
          params.validateOrThrow()
          return
        }
      }
      const dataState: DataState<PPEToolModel> =
        await this.AddPPEToolUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('ppe-tool')) {
          const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
          if (!draft) await router.push(`${root}/ppe-tools`)
        }

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
