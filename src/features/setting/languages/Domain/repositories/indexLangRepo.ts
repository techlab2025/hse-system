import { IndexLangApiService } from "@/features/setting/languages/Data/apiServices/indexLangApiService.ts";
import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class IndexLangRepo extends RepoInterface<LangModel[]> {
  private static instance: IndexLangRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexLangRepo();
    }
    return this.instance;
  }

  override get hasPagination(): boolean {
    return true;
  }

  onParse(data: any): LangModel[] {
    return data.map((item: any) => LangModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return IndexLangApiService.getInstance();
  }
}

export { IndexLangRepo };
