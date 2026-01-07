// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InspectionModel from '../../Data/models/InspectionModel'
import FetchAllTasksUseCase from '../../Domain/useCase/FetchAllTasksUseCase'

export default class FetchAllTasksController extends SelectControllerInterface<InspectionModel[]> {
  private static instance: FetchAllTasksController
  private constructor() {
    super()
  }
  private FetchAllTasksUseCase = new FetchAllTasksUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchAllTasksController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<InspectionModel[]> = await this.FetchAllTasksUseCase.call(params)

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
