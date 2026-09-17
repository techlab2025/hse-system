import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import FetchDrillActionsApiService from '../../../Data/apiServices/Drill/FetchDrillActionsApiService'
import DrillTimelineItemModel from '../../../Data/models/Drill/DrillTimelineItemModel'

type DrillActionsResponse = Record<string, unknown> | Array<Record<string, unknown>>

export default class FetchDrillActionsRepo extends RepoInterface<DrillTimelineItemModel[]> {
  private static instance: FetchDrillActionsRepo

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) this.instance = new FetchDrillActionsRepo()
    return this.instance
  }

  onParse(data: DrillActionsResponse): DrillTimelineItemModel[] {
    const response = Array.isArray(data) ? null : data
    const actions = Array.isArray(data)
      ? data
      : (response?.actions ?? response?.drill_actions ?? response?.drillActions ?? [])

    if (!Array.isArray(actions)) return []

    return actions.map((item, index) => DrillTimelineItemModel.fromMap(item, index))
  }

  get serviceInstance(): ServicesInterface {
    return FetchDrillActionsApiService.getInstance()
  }
}
