import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import { UpdateInvestigationTaskApiService } from '../../../Data/apiServices/InvestigationTask/UpdateInvestigationTaskApiService'

class UpdateInvestigationTaskRepo extends RepoInterface<void> {
  private static instance: UpdateInvestigationTaskRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdateInvestigationTaskRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return false
  }

  onParse(data: any): void {
    console.log(data)
    return
  }

  get serviceInstance(): ServicesInterface {
    return UpdateInvestigationTaskApiService.getInstance()
  }
}

export { UpdateInvestigationTaskRepo }
