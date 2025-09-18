import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import EmployeeModel from "@/features/dashboard/users/employee/Data/models/index_employee_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import DeleteEmployeeUseCase from "@/features/dashboard/users/employee/Domain/useCase/delete_employee_use_case";
import DialogSelector from "@/base/persention/Dialogs/dialog_selector";
import errorImage from "@/assets/images/error.png";

export default class DeleteEmployeeController extends ControllerInterface<EmployeeModel> {
  private static instance: DeleteEmployeeController;
  private constructor() {
    super();
  }
  private DeleteEmployeeUseCase = new DeleteEmployeeUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteEmployeeController();
    }
    return this.instance;
  }

  async deleteEmployee(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<EmployeeModel> =
        await this.DeleteEmployeeUseCase.call(params);

      this.setState(dataState);
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error("Error while addServices");
      }
    } catch (error: any) {
      console.log(error);
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: "dialog",
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      });
    }
    super.handleResponseDialogs();
    return this.state;
  }
}
