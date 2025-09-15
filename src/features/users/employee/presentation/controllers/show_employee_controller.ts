import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import ShowEmployeeModel from "@/features/dashboard/users/employee/Data/models/show_employee_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import ShowEmployeeUseCase from "@/features/dashboard/users/employee/Domain/use_case/show_employee_use_case";

export default class ShowEmployeeController extends ControllerInterface<ShowEmployeeModel> {
  private static instance: ShowEmployeeController;

  private constructor() {
    super();
  }

  private ShowEmployeeUseCase = new ShowEmployeeUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowEmployeeController();
    }
    return this.instance;
  }

  async showEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading();

    const dataState: DataState<ShowEmployeeModel> =
      await this.ShowEmployeeUseCase.call(params);

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
