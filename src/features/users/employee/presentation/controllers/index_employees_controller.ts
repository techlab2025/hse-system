import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
import EmployeeModel from "@/features/users/employee/Data/models/index_employee_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import IndexEmployeeUseCase from "@/features/users/employee/Domain/useCase/index_employees_use_case";
import { SelectControllerInterface } from "@/base/Presentation/Controller/select_controller_interface";

export default class IndexEmployeeController extends SelectControllerInterface<
  EmployeeModel[]
> {
  private static instance: IndexEmployeeController;
  private constructor() {
    super();
  }
  private IndexEmployeeUseCase = new IndexEmployeeUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexEmployeeController();
    }
    return this.instance;
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading();
    const dataState: DataState<EmployeeModel[]> =
      await this.IndexEmployeeUseCase.call(params);

    this.setState(dataState);
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error("Error while addServices");
    }
    super.handleResponseDialogs();
    return this.state;
  }
}
