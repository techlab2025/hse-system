import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ProjectModel from '../../Data/models/ProjectModel'
import DeleteProjectUseCase from '../../Domain/useCase/deleteProjectUseCase'

export default class DeleteProjectController extends ControllerInterface<ProjectModel> {
  private static instance: DeleteProjectController
  private constructor() {
    super()
  }
  private DeleteProjectUseCase = new DeleteProjectUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteProjectController()
    }
    return this.instance
  }

  async deleteProject(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ProjectModel> =
        await this.DeleteProjectUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
