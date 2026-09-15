import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type MangementChangeTopicTypeModel from '../../Data/models/MangementChangeTopicTypeModel'
import AddMangementChangeTopicTypeUseCase from '../../Domain/useCase/addMangementChangeTopicTypeUseCase'
import type AddMangementChangeTopicTypeParams from '../../Core/params/addMangementChangeTopicTypeParams'

export default class AddMangementChangeTopicTypeController extends ControllerInterface<MangementChangeTopicTypeModel> {
  private static instance: AddMangementChangeTopicTypeController
  private constructor() {
    super()
  }
  private AddMangementChangeTopicTypeUseCase = new AddMangementChangeTopicTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMangementChangeTopicTypeController()
    }
    return this.instance
  }

  async addMangementChangeTopicType(
    params: AddMangementChangeTopicTypeParams ,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<MangementChangeTopicTypeModel> =
        await this.AddMangementChangeTopicTypeUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
  DialogSelector.instance.successDialog.openDialog({
    dialogName: 'dialog-success',
    titleContent: this.state.value.message,
    imageElement: successImage,
    messageContent: null,
  })

  const root = router.currentRoute.value.path.startsWith('/admin')
    ? '/admin'
    : '/organization'

  await router.push(`${root}/management-change-topic-type`)
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
