import { AcceptClientApiService } from "@/features/users/clients/clients/Data/apiServices/acceptClientApiService.ts";
import ClientModel from "@/features/users/clients/clients/Data/models/clientModel.ts";
import RepoInterface, {
  ResponseType,
} from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class AcceptClientRepo extends RepoInterface<ClientModel> {
  private static instance: AcceptClientRepo;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }
  static getInstance() {
    if (!this.instance) {
      this.instance = new AcceptClientRepo();
    }
    return this.instance;
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: any): ClientModel {
    return ClientModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return AcceptClientApiService.getInstance();
  }
}

export { AcceptClientRepo };
