import { ShowObservationApiService } from '@/features/setting/Observation/Data/apiServices/showObservationApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import ObservationDetailsModel from '@/features/setting/Observation/Data/models/observationDetailsModel'

class ShowObservationRepo extends RepoInterface<ObservationDetailsModel> {
  private static instance: ShowObservationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowObservationRepo()
    }
    return this.instance
  }

  onParse(data: any): ObservationDetailsModel {
    return ObservationDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowObservationApiService.getInstance()
  }
}

export { ShowObservationRepo }
