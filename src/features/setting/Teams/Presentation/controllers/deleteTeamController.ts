import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import DeleteTeamUseCase from '../../Domain/useCase/deleteTeamUseCase'
import successImage from '@/assets/images/Success.png'
import type TeamModel from '../../Data/models/TeamModel'

export default class DeleteTeamController extends ControllerInterface<TeamModel> {
  private static instance: DeleteTeamController
  private constructor() {
    super()
  }
  private deleteTeamUseCase = new DeleteTeamUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTeamController()
    }
    return this.instance
  }

  async deleteTeam(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<TeamModel> = await this.deleteTeamUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'deleted was successful',
          imageElement: successImage,
          messageContent: null,
        })

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
