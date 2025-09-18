import { AddLangApiService } from "@/features/setting/languages/Data/apiServices/addLangApiService.ts";
import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class AddLangRepo extends RepoInterface<LangModel> {
  private static instance: AddLangRepo;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddLangRepo();
    }
    return this.instance;
  }

  onParse(data: any): LangModel {
    return LangModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return AddLangApiService.getInstance();
  }
}

export { AddLangRepo };
