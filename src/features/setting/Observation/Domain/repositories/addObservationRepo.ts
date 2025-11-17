import { AddObservationApiService } from '@/features/setting/Observation/Data/apiServices/addObservationApiService'
// import LangModel from '@/features/setting/Observation/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ObservationModel from '@/features/setting/Observation/Data/models/observationModel'

class AddObservationRepo extends RepoInterface<ObservationModel> {
  private static instance: AddObservationRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddObservationRepo()
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
    return AddObservationApiService.getInstance()
  }
}

export { AddObservationRepo }
