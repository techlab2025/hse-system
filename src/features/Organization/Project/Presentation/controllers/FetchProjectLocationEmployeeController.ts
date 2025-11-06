import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import FetchProjectLocationEmployeeUseCase from '../../Domain/useCase/FetchProjectLocationEmployeeUsecase'
import type ProjectLocationEmployeesModel from '../../Data/models/ProjectLocationEmployee'

export default class FetchProjectLocationEmployeeController extends ControllerInterface<
  ProjectLocationEmployeesModel[]
> {
  private static instance: FetchProjectLocationEmployeeController

  private constructor() {
    super()
  }

  private fetchProjectLocationEmployeeUseCase = new FetchProjectLocationEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectLocationEmployeeController()
    }
    return this.instance
  }

  async FetchProjectLocationEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ProjectLocationEmployeesModel[]> =
      await this.fetchProjectLocationEmployeeUseCase.call(params)

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
