import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OverviewInvestigationsChartModel from '../../data/Model/OverviewInvestigationsChartModel'
import { OverviewInvestigationsChartApiService } from '../../data/ApiService/OverviewInvestigationsChartApiService'

class OverviewInvestigationsChartRepo extends RepoInterface<OverviewInvestigationsChartModel> {
  private static instance: OverviewInvestigationsChartRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new OverviewInvestigationsChartRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): OverviewInvestigationsChartModel {
    return OverviewInvestigationsChartModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return OverviewInvestigationsChartApiService.getInstance()
  }
}

export { OverviewInvestigationsChartRepo }
