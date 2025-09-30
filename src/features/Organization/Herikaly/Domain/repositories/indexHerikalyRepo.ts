// import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from '@/base/Domain/Repositories/repo_interface'
import type ServicesInterface from '@/base/Data/ApiService/api_service_interface'
import HerikalyModel from '../../Data/models/HerikalyModel'
import { IndexHerikalyApiService } from '../../Data/apiServices/indexHerikalyApiService'




class IndexHerikalyRepo extends RepoInterface<HerikalyModel[]> {
  private static instance: IndexHerikalyRepo

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexHerikalyRepo()
    }
    return this.instance
  }

  override get hasPagination(): boolean {
    return true
  }

  onParse(data: any): HerikalyModel[] {
    return data.map((item: any) => HerikalyModel.fromMap(item))
  }

  get serviceInstance(): ServicesInterface {
    return IndexHerikalyApiService.getInstance()
  }
}

export { IndexHerikalyRepo }
