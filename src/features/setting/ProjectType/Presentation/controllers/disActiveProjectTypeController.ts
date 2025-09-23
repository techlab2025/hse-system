import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import disActiveProjectTypeUseCase from '@/features/setting/ProjectType/Domain/useCase/disProjectTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

export default class disActiveProjectTypeController extends ControllerInterface<ProjectTypeModel> {
  private static instance: disActiveProjectTypeController
  private constructor() {
    super()
  }
  private disActiveProjectTypeUseCase = new disActiveProjectTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new disActiveProjectTypeController()
    }
    return this.instance
  }

  async disActiveProjectType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectTypeModel> =
      await this.disActiveProjectTypeUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: successImage,
        messageContent: null,
      })
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title! ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
