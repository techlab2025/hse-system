import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import EmployeeModel from "@/features/dashboard/users/employee/Data/models/index_employee_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import EditEmployeeUseCase from "@/features/dashboard/users/employee/Domain/useCase/edit_employee_use_case";
import DialogSelector from "@/base/persention/Dialogs/dialog_selector";
import successImage from "@/assets/images/Success.png";
import errorImage from "@/assets/images/Error.png";

export default class EditEmployeeController extends ControllerInterface<EmployeeModel> {
  private static instance: EditEmployeeController;

  private constructor() {
    super();
  }

  private EditEmployeeUseCase = new EditEmployeeUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditEmployeeController();
    }
    return this.instance;
  }

  async editEmployee(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<EmployeeModel> =
        await this.EditEmployeeUseCase.call(params);

      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Added was successful",
          imageElement: successImage,
          messageContent: null,
        });
        if (!draft) await router.push("/users/employees");
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: "dialog",
          titleContent: this.state.value.message,
          imageElement: errorImage,
          messageContent: null,
        });
        throw new Error(this.state.value.error?.title);
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: "dialog",
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      });
    }
    return this.state;
  }
}
