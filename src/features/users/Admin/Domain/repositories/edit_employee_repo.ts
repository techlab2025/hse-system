import { EditEmployeeApiService } from "@/features/users/Admin/Data/apiServices/edit_employee_api_service";
import EmployeeModel from "@/features/users/Admin/Data/models/index_employee_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class EditEmployeeRepo extends RepoInterface<EmployeeModel> {
  private static instance: EditEmployeeRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditEmployeeRepo();
    }
    return this.instance;
  }

  onParse(data: any): EmployeeModel {
    return EmployeeModel.fromMap(data);
  }

  get serviceInstance(): ServicesInterface {
    return EditEmployeeApiService.getInstance();
  }
}

export { EditEmployeeRepo };
