import RepoInterface, {
  ResponseType,
} from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";
import AdminModel from "../../Data/models/index_admin_model";
import { DeleteAdminApiService } from "../../Data/apiServices/delete_admin_api_service";

class DeleteAdminRepo extends RepoInterface<AdminModel> {
  private static instance: DeleteAdminRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAdminRepo();
    }
    return this.instance;
  }

  override get responseType(): ResponseType {
    return ResponseType.withoutData;
  }

  onParse(data: any): AdminModel {
    return AdminModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return DeleteAdminApiService.getInstance();
  }
}

export { DeleteAdminRepo };
