import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ProjectModel from '../../Data/models/ProjectModel'
import DeleteProjectLocationTeamEmployeeUseCase from '../../Domain/useCase/DeleteProjectLocationTeamEmployeeUseCase'
import ShowProjectDetailsParams from '../../Core/params/ShowProjectDetailsParams'
import ShowProjectDetailsController from './ShowProjectDetailsController'
import { useRoute } from 'vue-router'
import successImage from '@/assets/images/Success.png'

export default class DeleteProjectLocationTeamEmployeeController extends ControllerInterface<ProjectModel> {
  private static instance: DeleteProjectLocationTeamEmployeeController
  private constructor() {
    super()
  }
  private deleteProjectLocationTeamEmployeeUseCase = new DeleteProjectLocationTeamEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteProjectLocationTeamEmployeeController()
    }
    return this.instance
  }

  async deleteProjectLocationTeamEmployee(params: Params, route: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    try {
      const dataState: DataState<ProjectModel> =
        await this.deleteProjectLocationTeamEmployeeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await ShowProjectDetailsController.getInstance().showProjectDetails(
          new ShowProjectDetailsParams(Number(route.params?.id)),
        )
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
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
