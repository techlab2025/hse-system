import { ShowClientApiService } from "@/features/users/clients/Data/apiServices/show_client_api_service";
import ShowClientModel from "@/features/users/clients/Data/models/show_client_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class ShowClientRepo extends RepoInterface<ShowClientModel> {
  private static instance: ShowClientRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowClientRepo();
    }
    return this.instance;
  }

  onParse(data: any): ShowClientModel {
    return ShowClientModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ShowClientApiService.getInstance();
  }
}

export { ShowClientRepo };
