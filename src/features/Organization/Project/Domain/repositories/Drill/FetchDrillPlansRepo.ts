import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchDrillPlansApiService from '../../../Data/apiServices/Drill/FetchDrillPlansApiService'
import DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'

type DrillPlansResponse = Record<string, unknown> | Array<Record<string, unknown>>

export default class FetchDrillPlansRepo extends RepoInterface<DrillTimelineItemModel[]> {
  private static instance: FetchDrillPlansRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchDrillPlansRepo()
    return this.instance
  }

  onParse(data: DrillPlansResponse): DrillTimelineItemModel[] {
    const response = Array.isArray(data) ? null : data
    const plans = Array.isArray(data)
      ? data
      : (response?.plans ??
        response?.planning ??
        response?.drill_plans ??
        response?.drillPlans ??
        [])

    if (!Array.isArray(plans)) return []

    return plans.map((item, index) => DrillTimelineItemModel.fromMap(item, index))
  }

  get serviceInstance(): ServicesInterface {
    return FetchDrillPlansApiService.getInstance()
  }
}
