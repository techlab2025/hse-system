import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { SimilarObservationApiService } from '../../../Data/apiServices/SimilarObservation/SimilarObservationApiService'
import HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'

class SimilarObservationRepo extends RepoInterface<HazardDetailsModel[]> {
  private static instance: SimilarObservationRepo
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new SimilarObservationRepo()
    }
    return this.instance
  }

  // override get responseType(): ResponseType {
  //   return ResponseType.withoutData
  // }

  onParse(data: any): HazardDetailsModel[] {
    return data.data.map((item: any) => HazardDetailsModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return SimilarObservationApiService.getInstance()
  }
}

export { SimilarObservationRepo }
