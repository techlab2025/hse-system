// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import FetchInspectionResultUseCase from '../../Domain/useCase/FetchInspectionResultUseCase'
import type FetchInspectionResultModel from '../../Data/models/FetchInspectionResultModel'
import type TaskResultModel from '../../Data/models/FetchTaskResultModels/TasksResultModel'

export default class FetchInspectionResultController extends SelectControllerInterface<
  TaskResultModel[]
> {
  private static instance: FetchInspectionResultController
  private constructor() {
    super()
  }
  private fetchInspectionResultUseCase = new FetchInspectionResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchInspectionResultController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<TaskResultModel[]> =
      await this.fetchInspectionResultUseCase.call(params)

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
