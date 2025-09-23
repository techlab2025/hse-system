import { AddClientApiService } from "@/features/users/clients/Data/apiServices/add_client_api_service";
import ClientModel from "@/features/users/clients/Data/models/index_client_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class AddClientRepo extends RepoInterface<ClientModel> {
  private static instance: AddClientRepo;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AddClientRepo();
    }
    return this.instance;
  }

  onParse(data: any): ClientModel {
    return ClientModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return AddClientApiService.getInstance();
  }
}

export { AddClientRepo };
