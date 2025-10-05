import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import DialogSelector from "@/base/Presentation/Dialogs/dialog_selector";
import errorImage from "@/assets/images/error.png";
import type AdminModel from "../../Data/models/index_admin_model";
import DeleteAdminUseCase from "../../Domain/useCase/delete_admin_use_case";

export default class DeleteAdminController extends ControllerInterface<AdminModel> {
  private static instance: DeleteAdminController;
  private constructor() {
    super();
  }
  private DeleteAdminUseCase = new DeleteAdminUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteAdminController();
    }
    return this.instance;
  }

  async deleteAdmin(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AdminModel> =
        await this.DeleteAdminUseCase.call(params);

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
