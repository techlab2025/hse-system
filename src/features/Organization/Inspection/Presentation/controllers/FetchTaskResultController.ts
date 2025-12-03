// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import FetchTaskResultUseCase from '../../Domain/useCase/FetchTaskResultUseCase'
import type TaskFullResponseModel from '../../Data/models/FetchTaskResultModels/FullTaskResultModel'

export default class FetchTaskResultController extends SelectControllerInterface<
  TaskFullResponseModel
> {
  private static instance: FetchTaskResultController
  private constructor() {
    super()
  }
  private fetchTaskResultUseCase = new FetchTaskResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchTaskResultController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<TaskFullResponseModel> =
      await this.fetchTaskResultUseCase.call(params)

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
