// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import { IndexTicketTypeApiService } from '../../Data/apiServices/indexTicketTypeApiService'
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketTypeModel from '../../Data/models/TicketTypeModel'

class IndexTicketTypeRepo extends RepoInterface<TicketTypeModel[]> {
  private static instance: IndexTicketTypeRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTicketTypeRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TicketTypeModel[] {
    return data.map((item: any) => TicketTypeModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexTicketTypeApiService.getInstance()
  }
}

export { IndexTicketTypeRepo }
