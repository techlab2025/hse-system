import { DeleteClientApiService } from "@/features/dashboard/users/languages/Data/apiServices/delete_client_api_service";
import ClientModel from "@/features/dashboard/users/languages/Data/models/index_client_model";
import RepoInterface, {
  ResponseType,
} from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class DeleteClientRepo extends RepoInterface<ClientModel> {
  private static instance: DeleteClientRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteClientRepo();
    }
    return this.instance;
  }

  onParse(data: any): ClientModel {
    return ClientModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return DeleteClientApiService.getInstance();
  }
}

export { DeleteClientRepo };
