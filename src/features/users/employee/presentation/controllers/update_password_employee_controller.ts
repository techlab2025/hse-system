import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import EmployeeModel from "@/features/dashboard/users/employee/Data/models/index_employee_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import UpdatePasswordEmployeeUseCase from "@/features/dashboard/users/employee/Domain/useCase/update_password_employee_use_case";
import DialogSelector from "@/base/persention/Dialogs/dialog_selector";
import successImage from "@/assets/images/Success.png";
import errorImage from "@/assets/images/Error.png";

export default class UpdatePasswordEmployeeController extends ControllerInterface<EmployeeModel> {
  private static instance: UpdatePasswordEmployeeController;
  private constructor() {
    super();
  }
  private UpdatePasswordEmployeeUseCase = new UpdatePasswordEmployeeUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new UpdatePasswordEmployeeController();
    }
    return this.instance;
  }

  async updatePasswordEmployee(
    params: Params,
    router: any,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<EmployeeModel> =
        await this.UpdatePasswordEmployeeUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Update password was successful",
          imageElement: successImage,
          messageContent: null,
        });

        // console.log(this.state.value.data)
        // console.log(draft)
        if (!draft) await router.push("/users/employees");

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
      console.log(this.state.value.message);
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
