import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type ProjectFlowDetailsModel from '../../../Data/models/UpdatedProjectFlow/ProjectFlowDetailsModel'
import ProjectFlowDetailsUseCase from '../../../Domain/useCase/UpdatedProjectFlow/ProjectFlowDetailsUseCase'

export default class ProjectFlowDetailsController extends ControllerInterface<ProjectFlowDetailsModel> {
  private static instance: ProjectFlowDetailsController
  private readonly projectFlowDetailsUseCase = new ProjectFlowDetailsUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new ProjectFlowDetailsController()
    return this.instance
  }

  async show(params: Params) {
    this.setLoading()
    try {
      const dataState: DataState<ProjectFlowDetailsModel> =
        await this.projectFlowDetailsUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Loaded successfully',
          imageElement: successImage,
          messageContent: null,
        })
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
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
