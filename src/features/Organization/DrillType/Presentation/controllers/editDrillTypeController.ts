import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type DrillTypeModel from '../../Data/models/DrillTypeModel'
import EditDrillTypeUseCase from '../../Domain/useCase/editDrillTypeUseCase'
import type { Router } from 'vue-router'

export default class EditDrillTypeController extends ControllerInterface<DrillTypeModel> {
  private static instance: EditDrillTypeController

  private constructor() {
    super()
  }

  private EditDrillTypeUseCase = new EditDrillTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditDrillTypeController()
    }
    return this.instance
  }

  async editDrillType(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<DrillTypeModel> =
        await this.EditDrillTypeUseCase.call(params)
      this.setLoading()

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
        await router.push(`${root}/drill-types`)
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
