import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import DialogSelector from "@/base/Presentation/Dialogs/dialog_selector";
import successImage from "@/assets/images/Success.png";
import errorImage from "@/assets/images/error.png";
import type AdminModel from "../../Data/models/index_admin_model";
import EditAdminUseCase from "../../Domain/useCase/edit_admin_use_case";

export default class EditAdminController extends ControllerInterface<AdminModel> {
  private static instance: EditAdminController;

  private constructor() {
    super();
  }

  private EditAdminUseCase = new EditAdminUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAdminController();
    }
    return this.instance;
  }

  async editAdmin(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AdminModel> =
        await this.EditAdminUseCase.call(params);

      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Added was successful",
          imageElement: successImage,
          messageContent: null,
        });
        if (!draft) await router.push("/admin/admins");
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
