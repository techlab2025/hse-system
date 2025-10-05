import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";
import ShowAdminModel from "../../Data/models/show_admin_model";
import { ShowAdminApiService } from "../../Data/apiServices/show_admin_api_service";

class ShowAdminRepo extends RepoInterface<ShowAdminModel> {
  private static instance: ShowAdminRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAdminRepo();
    }
    return this.instance;
  }

  onParse(data: any): ShowAdminModel {
    return ShowAdminModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ShowAdminApiService.getInstance();
  }
}

export { ShowAdminRepo };
