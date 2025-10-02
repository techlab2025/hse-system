import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowProjectUseCase from '../../Domain/useCase/showProjectUseCase'
import type ProjectDetailsModel from '../../Data/models/ProjectDetailsModel'

export default class ShowProjectController extends ControllerInterface<ProjectDetailsModel> {
  private static instance: ShowProjectController

  private constructor() {
    super()
  }

  private ShowProjectUseCase = new ShowProjectUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowProjectController()
    }
    return this.instance
  }

  async showProject(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ProjectDetailsModel> =
      await this.ShowProjectUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
