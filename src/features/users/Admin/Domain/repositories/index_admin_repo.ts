import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";
import AdminModel from "../../Data/models/index_admin_model";
import { IndexAdminApiService } from "../../Data/apiServices/index_admin_api_service";

class IndexAdminRepo extends RepoInterface<AdminModel[]> {
  private static instance: IndexAdminRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAdminRepo();
    }
    return this.instance;
  }

  override get hasPagination(): boolean {
    return true;
  }

  onParse(data: any): AdminModel[] {
    return data.map((item: any) => AdminModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return IndexAdminApiService.getInstance();
  }
}

export { IndexAdminRepo };
