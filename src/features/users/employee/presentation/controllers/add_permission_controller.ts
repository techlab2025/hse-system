import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
import EmployeeModel from "@/features/users/employee/Data/models/index_employee_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import AddPermissionUseCase from "@/features/users/employee/Domain/useCase/add_permission_use_case";
import DialogSelector from "@/base/Presentation/Dialogs/dialog_selector";
import successImage from "@/assets/images/Success.png";
import errorImage from "@/assets/images/error.png";

export default class AddPermissionController extends ControllerInterface<EmployeeModel> {
  private static instance: AddPermissionController;
  private constructor() {
    super();
  }
  private AddPermissionUseCase = new AddPermissionUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddPermissionController();
    }
    return this.instance;
  }

  async addPermission(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<EmployeeModel> =
        await this.AddPermissionUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Added was successful",
          imageElement: successImage,
          messageContent: null,
        });

        await router.push("/users/employees");

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: "dialog",
          titleContent: this.state.value.error?.title ?? "An Error Occurred",
          imageElement: errorImage,
          messageContent: null,
        });
        // throw new Error(this.state.value.error?.title)
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: "dialog",
        titleContent: this.state.value.message,
        // titleContent: 'adssddsasdadsa',
        imageElement: errorImage,
        messageContent: null,
      });
    }

    super.handleResponseDialogs();
    return this.state;
  }
}
