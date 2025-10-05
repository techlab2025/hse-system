import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
// import PermissionModel from '@/features/users/employee/Data/models/show_employee_model'
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import ShowEmployeePermissionUseCase from "@/features/users/Admin/Domain/useCase/show_permission_use_case";
import PermissionModel from "@/features/users/Admin/Data/models/permission_model";

export default class ShowEmployeePermissionController extends ControllerInterface<PermissionModel> {
  private static instance: ShowEmployeePermissionController;

  private constructor() {
    super();
  }

  private ShowEmployeePermissionUseCase = new ShowEmployeePermissionUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowEmployeePermissionController();
    }
    return this.instance;
  }

  async ShowEmployeePermission(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading();

    const dataState: DataState<PermissionModel> =
      await this.ShowEmployeePermissionUseCase.call(params);

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
