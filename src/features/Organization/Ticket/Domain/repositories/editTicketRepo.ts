// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketModel from '../../Data/models/TicketModel'
import { EditTicketApiService } from '../../Data/apiServices/editTicketApiService'

class EditTicketRepo extends RepoInterface<TicketModel> {
  private static instance: EditTicketRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTicketRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): TicketModel {
    return TicketModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditTicketApiService.getInstance()
  }
}

export { EditTicketRepo }
