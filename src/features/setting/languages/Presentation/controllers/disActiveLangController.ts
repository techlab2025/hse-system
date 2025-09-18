import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import ClientModel from "@/features/dashboard/users/languages/Data/models/index_client_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import AcceptClientUseCase from "@/features/dashboard/users/languages/Domain/useCase/accept_client_use_case";
import DialogSelector from "@/base/persention/Dialogs/dialog_selector";
import successImage from "@/assets/images/success-dialog.png";
import errorImage from "@/assets/images/error.png";

export default class AcceptClientController extends ControllerInterface<ClientModel> {
  private static instance: AcceptClientController;
  private constructor() {
    super();
  }
  private AcceptClientUseCase = new AcceptClientUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new AcceptClientController();
    }
    return this.instance;
  }

  async acceptClient(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading();
    const dataState: DataState<ClientModel> =
      await this.AcceptClientUseCase.call(params);

    this.setState(dataState);
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: "dialog",
        titleContent: "Client status changed successfully.",
        imageElement: successImage,
        messageContent: null,
      });
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: "dialog",
        titleContent: this.state.value.error?.title!,
        imageElement: errorImage,
        messageContent: null,
      });
      throw new Error("Error while addServices");
    }
    super.handleResponseDialogs();
    return this.state;
  }
}
