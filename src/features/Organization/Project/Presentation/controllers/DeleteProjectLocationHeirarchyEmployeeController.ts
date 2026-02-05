import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type ProjectModel from '../../Data/models/ProjectModel'
import DeleteProjectLocationHeirarchyEmployeeUseCase from '../../Domain/useCase/DeleteProjectLocationHeirarchyEmployeeUseCase'
import ShowProjectDetailsController from './ShowProjectDetailsController'
import ShowProjectDetailsParams from '../../Core/params/ShowProjectDetailsParams'

export default class DeleteProjectLocationHeirarchyEmployeeController extends ControllerInterface<ProjectModel> {
  private static instance: DeleteProjectLocationHeirarchyEmployeeController
  private constructor() {
    super()
  }
  private deleteProjectLocationHeirarchyEmployeeUseCase =
    new DeleteProjectLocationHeirarchyEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteProjectLocationHeirarchyEmployeeController()
    }
    return this.instance
  }

  async deleteProjectLocationHeirarchyEmployee(params: Params, route: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ProjectModel> =
        await this.deleteProjectLocationHeirarchyEmployeeUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
        await ShowProjectDetailsController.getInstance().showProjectDetails(
          new ShowProjectDetailsParams(Number(route.params?.id || route.params?.project_id)),
        )
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      // DialogSelector.instance.failedDialog.openDialog({
      //   dialogName: 'dialog',
      //   titleContent: this.state.value.message,
      //   imageElement: errorImage,
      //   messageContent: null,
      // })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
