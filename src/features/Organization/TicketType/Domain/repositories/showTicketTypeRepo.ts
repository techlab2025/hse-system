import { ShowTicketTypeApiService } from '../../Data/apiServices/showTicketTypeApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketTypeDetailsModel from '../../Data/models/TicketTypeDetailsModel'

class ShowTicketTypeRepo extends RepoInterface<TicketTypeDetailsModel> {
  private static instance: ShowTicketTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTicketTypeRepo()
    }
    return this.instance
  }

  onParse(data: any): TicketTypeDetailsModel {
    return TicketTypeDetailsModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return ShowTicketTypeApiService.getInstance()
  }
}

export { ShowTicketTypeRepo }
