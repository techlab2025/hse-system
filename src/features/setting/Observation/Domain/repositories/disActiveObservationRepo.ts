import { DisObservationApiService } from '@/features/setting/Observation/Data/apiServices/disObservationApiService'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObservationModel from '@/features/setting/Observation/Data/models/observationModel'

class DisActiveObservationRepo extends RepoInterface<ObservationModel> {
  private static instance: DisActiveObservationRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new DisActiveObservationRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  onParse(data: any): ObservationModel {
    return ObservationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DisObservationApiService.getInstance()
  }
}

export { DisActiveObservationRepo }
