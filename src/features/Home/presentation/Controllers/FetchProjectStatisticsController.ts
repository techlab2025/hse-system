import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import FetchProjectStatisticsUseCase from '../../domain/usecase/FetchProjectStatisticsUseCase'
import type ProjectStatisticsModel from '../../data/Model/ProjectStatisticsModel'

export default class FetchPorjectStatisticsController extends SelectControllerInterface<ProjectStatisticsModel> {
  private static instance: FetchPorjectStatisticsController
  private constructor() {
    super()
  }
  private fetchProjectStatisticsUseCase = new FetchProjectStatisticsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchPorjectStatisticsController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ProjectStatisticsModel> =
      await this.fetchProjectStatisticsUseCase.call(params)

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
