import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type ProjectLocationEmployeesModel from '../../Data/models/ProjectLocationEmployee'
import FetchProjectLocationsEmployeeUseCase from '../../Domain/useCase/FetchProjectLocationsEmployeeUsecase'

export default class FetchProjectLocationsEmployeeController extends ControllerInterface<
  ProjectLocationEmployeesModel[]
> {
  private static instance: FetchProjectLocationsEmployeeController

  private constructor() {
    super()
  }

  private fetchProjectLocationsEmployeeUseCase = new FetchProjectLocationsEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchProjectLocationsEmployeeController()
    }
    return this.instance
  }

  async FetchProjectLocationsEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ProjectLocationEmployeesModel[]> =
      await this.fetchProjectLocationsEmployeeUseCase.call(params)

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
