import { ShowLangApiService } from "@/features/setting/languages/Data/apiServices/showLangApiService";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";
import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'

class ShowLangRepo extends RepoInterface<ShowLangModel> {
  private static instance: ShowLangRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowLangRepo();
    }
    return this.instance;
  }

  onParse(data: any): ShowLangModel {
    return ShowLangModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ShowLangApiService.getInstance();
  }
}

export { ShowLangRepo };
