import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type ProjectModel from '../../Data/models/ProjectModel'
import CreateProjectLocationTeamEmployeeUseCase from '../../Domain/useCase/CreateProjectLocationTeamEmployeeUseCase'
import ShowProjectDetailsController from './ShowProjectDetailsController'
import ShowProjectDetailsParams from '../../Core/params/ShowProjectDetailsParams'

export default class CreateProjectLocationTeamEmployeeController extends ControllerInterface<ProjectModel> {
  private static instance: CreateProjectLocationTeamEmployeeController

  private constructor() {
    super()
  }

  private createProjectLocationTeamEmployeeUseCase = new CreateProjectLocationTeamEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateProjectLocationTeamEmployeeController()
    }
    return this.instance
  }

  async CreatePorjectLocationTeamEmployee(params: Params, route: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ProjectModel> =
        await this.createProjectLocationTeamEmployeeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: this.state.value.message,
        //   imageElement: successImage,
        //   messageContent: null,
        // })
        // await router.push('/organization/projects')
        // console.log(this.state.value.data)
        await ShowProjectDetailsController.getInstance().showProjectDetails(
          new ShowProjectDetailsParams(Number(route?.params?.id)),
        )
      } else {
        // DialogSelector.instance.failedDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
        //   imageElement: errorImage,
        //   messageContent: null,
        // })
      }
    } catch (error: any) {
      // DialogSelector.instance.failedDialog.openDialog({
      //   dialogName: 'dialog',
      //   titleContent: this.state.value.message,
      //   imageElement: errorImage,
      //   messageContent: null,
      // })
    }
    return this.state
  }
}
