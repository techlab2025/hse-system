import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import OverviewHazardChartUseCase from '../../domain/usecase/OverviewHazardChartUseCase'
import type OverviewHazardChartModel from '../../data/Model/OverviewHazardChartModel'

export default class OverviewHazardChartController extends SelectControllerInterface<OverviewHazardChartModel[]> {
  private static instance: OverviewHazardChartController
  private constructor() {
    super()
  }
  private overviewHazardChartUseCase = new OverviewHazardChartUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new OverviewHazardChartController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<OverviewHazardChartModel[]> =
      await this.overviewHazardChartUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    console.log(this.state.value, "this.state.valuedsdddddddddddddddd");
    return this.state
  }
}
