import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import OverviewInvestigationsChartUseCase from '../../domain/usecase/OverviewInvestigationsChartUseCase'
import type OverviewInvestigationsChartModel from '../../data/Model/OverviewInvestigationsChartModel'

export default class OverviewInvestigationsChartController extends SelectControllerInterface<OverviewInvestigationsChartModel[]> {
  private static instance: OverviewInvestigationsChartController
  private constructor() {
    super()
  }
  private overviewInvestigationsChartUseCase = new OverviewInvestigationsChartUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new OverviewInvestigationsChartController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<OverviewInvestigationsChartModel[]> =
      await this.overviewInvestigationsChartUseCase.call(params)

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
