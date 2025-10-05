import { ShowEmployeeApiService } from "@/features/users/Admin/Data/apiServices/show_employee_api_service";
import ShowEmployeeModel from "@/features/users/Admin/Data/models/show_employee_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class ShowEmployeeRepo extends RepoInterface<ShowEmployeeModel> {
  private static instance: ShowEmployeeRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowEmployeeRepo();
    }
    return this.instance;
  }

  onParse(data: any): ShowEmployeeModel {
    return ShowEmployeeModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return ShowEmployeeApiService.getInstance();
  }
}

export { ShowEmployeeRepo };
