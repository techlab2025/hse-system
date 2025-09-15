import { IndexEmployeeApiService } from "@/features/dashboard/users/employee/Data/apiServices/index_employees_api_service";
import EmployeeModel from "@/features/dashboard/users/employee/Data/models/index_employee_model";
import RepoInterface from "@/base/Domain/Repositories/repo_interface";
import type ServicesInterface from "@/base/Data/ApiService/api_service_interface";

class IndexEmployeeRepo extends RepoInterface<EmployeeModel[]> {
  private static instance: IndexEmployeeRepo;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {
    super();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexEmployeeRepo();
    }
    return this.instance;
  }

  override get hasPagination(): boolean {
    return true;
  }

  onParse(data: any): EmployeeModel[] {
    return data.map((item: any) => EmployeeModel.fromMap(item));
  }

  get serviceInstance(): ServicesInterface {
    return IndexEmployeeApiService.getInstance();
  }
}

export { IndexEmployeeRepo };
