import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import ShiftModel from '../../Data/models/ShiftModel'
import { IndexShiftApiService } from '../../Data/apiServices/IndexShiftApiService'

class IndexShiftRepo extends RepoInterface<ShiftModel[]> {
  private static instance: IndexShiftRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexShiftRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): ShiftModel[] {
    return data.map((item: any) => ShiftModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexShiftApiService.getInstance()
  }
}

export { IndexShiftRepo }
