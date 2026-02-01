// import LangModel from '@/features/setting/languages/Data/models/langModel.ts'
import RepoInterface, { ResponseType } from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketTypeModel from '../../Data/models/TicketTypeModel'
import { EditTicketTypeApiService } from '../../Data/apiServices/editTicketTypeApiService'

class EditTicketTypeRepo extends RepoInterface<TicketTypeModel> {
  private static instance: EditTicketTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTicketTypeRepo()
    }
    return this.instance
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData
  }
  onParse(data: any): TicketTypeModel {
    return TicketTypeModel.fromMap(data)
  }

  get serviceInstance(): ServicesInterface {
    return EditTicketTypeApiService.getInstance()
  }
}

export { EditTicketTypeRepo }
