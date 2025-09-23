import { ShowEmployeePermissionApiService } from "@/features/users/employee/Data/apiServices/show_permission_api_service";
import PermissionModel from "@/features/users/employee/Data/models/permission_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";
// import PermissionModel from "@/features/users/employee/Data/models/permission_model";

class ShowEmployeePermissionRepo extends RepoInterface<PermissionModel> {
  private static instance: ShowEmployeePermissionRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowEmployeePermissionRepo();
    }
    return this.instance;
  }

  onParse(data: any): PermissionModel {
    return PermissionModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ShowEmployeePermissionApiService.getInstance();
  }
}

export { ShowEmployeePermissionRepo };
