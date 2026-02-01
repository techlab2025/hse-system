// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import TicketModel from '../../Data/models/TicketModel'
import { IndexTicketApiService } from '../../Data/apiServices/indexTicketApiService'

class IndexTicketRepo extends RepoInterface<TicketModel[]> {
  private static instance: IndexTicketRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTicketRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): TicketModel[] {
    return data.map((item: any) => TicketModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexTicketApiService.getInstance()
  }
}

export { IndexTicketRepo }
