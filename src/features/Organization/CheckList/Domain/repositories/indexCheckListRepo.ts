import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { IndexCheckListApiService } from '../../Data/apiServices/indexCheckListApiService'
import CheckListDetailsModel from '../../Data/models/CheckListModel'

class IndexCheckListRepo extends RepoInterface<CheckListDetailsModel[]> {
  private static instance: IndexCheckListRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCheckListRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {

    return true
  }

  onParse(data: any): CheckListDetailsModel[] {
    return data.map((item: any) => CheckListDetailsModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexCheckListApiService.getInstance()
  }

}

export { IndexCheckListRepo }
