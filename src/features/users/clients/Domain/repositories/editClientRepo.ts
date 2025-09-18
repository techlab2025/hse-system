import { EditClientApiService } from "@/features/dashboard/users/languages/Data/apiServices/edit_client_api_service";
import ClientModel from "@/features/dashboard/users/languages/Data/models/index_client_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class EditClientRepo extends RepoInterface<ClientModel> {
  private static instance: EditClientRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditClientRepo();
    }
    return this.instance;
  }

  onParse(data: any): ClientModel {
    return ClientModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return EditClientApiService.getInstance();
  }
}

export { EditClientRepo };
