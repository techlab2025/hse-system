import { IndexClientApiService } from "@/features/dashboard/users/clients/Data/apiServices/index_clients_api_service";
import ClientModel from "@/features/dashboard/users/clients/Data/models/index_client_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class IndexClientRepo extends RepoInterface<ClientModel[]> {
  private static instance: IndexClientRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexClientRepo();
    }
    return this.instance;
  }

  override get hasPagination(): boolean {
    return true;
  }

  onParse(data: any): ClientModel[] {
    return data.map((item: any) => ClientModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return IndexClientApiService.getInstance();
  }
}

export { IndexClientRepo };
