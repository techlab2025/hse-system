// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import OurSystemStepModel from '../../Data/models/OurSystemStepModel'
import { IndexOurSystemStepApiService } from '../../Data/apiServices/indexOurSystemStepApiService'

class IndexOurSystemStepRepo extends RepoInterface<OurSystemStepModel[]> {
  private static instance: IndexOurSystemStepRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOurSystemStepRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): OurSystemStepModel[] {
    return data.map((item: any) => OurSystemStepModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexOurSystemStepApiService.getInstance()
  }
}

export { IndexOurSystemStepRepo }
