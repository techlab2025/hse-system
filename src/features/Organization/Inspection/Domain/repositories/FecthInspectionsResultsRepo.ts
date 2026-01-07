import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import InspectionModel from '../../Data/models/InspectionModel'
import { FetchInspectionsResultsApiService } from '../../Data/apiServices/FetchInspectionsResultsApiService'

class FetchInspectionsResultsRepo extends RepoInterface<InspectionModel[]> {
  private static instance: FetchInspectionsResultsRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FetchInspectionsResultsRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): InspectionModel[] {
    return data.map((item: any) => InspectionModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return FetchInspectionsResultsApiService.getInstance()
  }
}

export { FetchInspectionsResultsRepo }
