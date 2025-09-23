import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ProjectTypeModel from '@/features/setting/ProjectType/Data/models/projectTypeModel.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DeleteProjectTypeUseCase from '@/features/setting/ProjectType/Domain/useCase/deleteProjectTypeUseCase.ts'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'

export default class DeleteProjectTypeController extends ControllerInterface<ProjectTypeModel> {
  private static instance: DeleteProjectTypeController
  private constructor() {
    super()
  }
  private DeleteProjectTypeUseCase = new DeleteProjectTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteProjectTypeController()
    }
    return this.instance
  }

  async deleteProjectType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ProjectTypeModel> =
        await this.DeleteProjectTypeUseCase.call(params)

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
