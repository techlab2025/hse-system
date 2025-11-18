// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import { IndexObservationApiService } from '@/features/setting/Observation/Data/apiServices/indexObservationApiService.ts'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObservationModel from '@/features/setting/Observation/Data/models/observationModel'

class IndexObservationRepo extends RepoInterface<ObservationModel[]> {
  private static instance: IndexObservationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexObservationRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ObservationModel[] {
    return data.map((item: any) => ObservationModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexObservationApiService.getInstance()
  }
}

export { IndexObservationRepo }
