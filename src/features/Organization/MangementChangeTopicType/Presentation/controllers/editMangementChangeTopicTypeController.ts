import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type MangementChangeTopicTypeModel from '../../Data/models/MangementChangeTopicTypeModel'
import EditMangementChangeTopicTypeUseCase from '../../Domain/useCase/editMangementChangeTopicTypeUseCase'

export default class EditMangementChangeTopicTypeController extends ControllerInterface<MangementChangeTopicTypeModel> {
  private static instance: EditMangementChangeTopicTypeController

  private constructor() {
    super()
  }

  private EditMangementChangeTopicTypeUseCase = new EditMangementChangeTopicTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditMangementChangeTopicTypeController()
    }
    return this.instance
  }

  async editMangementChangeTopicType(params: Params, router: Router) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<MangementChangeTopicTypeModel> =
        await this.EditMangementChangeTopicTypeUseCase.call(params)
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
        await router.push(`${root}/management-change-topic-type`)
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
