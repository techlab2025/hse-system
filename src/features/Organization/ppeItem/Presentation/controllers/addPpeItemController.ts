import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddPpeItemUseCase from '../../Domain/useCase/addPpeItemUseCase'
import type PpeItemModel from '../../Data/models/PpeItemModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddPpeItemExcelParams from '../../Core/params/addPpeItemExcelParams'
import AddPpeItemParams from '../../Core/params/addPpeItemParams'

export default class AddPpeItemController extends ControllerInterface<PpeItemModel> {
  private static instance: AddPpeItemController
  private constructor() {
    super()
  }
  private AddPpeItemUseCase = new AddPpeItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPpeItemController()
    }
    return this.instance
  }

  async addPpeItem(
    params: AddPpeItemParams | AddPpeItemExcelParams,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      if (params instanceof AddPpeItemExcelParams) {
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
      const dataState: DataState<PpeItemModel> =
        await this.AddPpeItemUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('ppe-item')) {
          const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
          if (!draft) await router.push(`${root}/ppe-items`)
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
