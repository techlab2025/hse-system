import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ProjectCustomLocationUseCase from '../../Domain/useCase/ProjectCusomLocationUsecase'
import type ProjectCustomLocationModel from '../../Data/models/CustomLocation/ProjectCustomLocationModel'

export default class ProjectCustomLocationController extends ControllerInterface<
  ProjectCustomLocationModel[]
> {
  private static instance: ProjectCustomLocationController

  private constructor() {
    super()
  }

  private projectCustomLocationUseCase = new ProjectCustomLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ProjectCustomLocationController()
    }
    return this.instance
  }

  async FetchProjecuCustomLocation(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ProjectCustomLocationModel[]> =
      await this.projectCustomLocationUseCase.call(params)

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
