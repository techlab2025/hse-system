import { DeleteObservationApiService } from '@/features/setting/Observation/Data/apiServices/deleteObservationApiService'
// import ClientModel from '@/features/setting/languages/Data/models/projectTypeModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import ObservationModel from '@/features/setting/Observation/Data/models/observationModel'

class DeleteObservationRepo extends RepoInterface<ObservationModel> {
  private static instance: DeleteObservationRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteObservationRepo()
    }
    return this.instance
  }

  onParse(data: any): ObservationModel {
    return ObservationModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return DeleteObservationApiService.getInstance()
  }
}

export { DeleteObservationRepo }
