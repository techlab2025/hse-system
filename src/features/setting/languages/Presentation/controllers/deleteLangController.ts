import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import ClientModel from "@/features/dashboard/users/languages/Data/models/index_client_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import DeleteClientUseCase from "@/features/dashboard/users/languages/Domain/useCase/delete_client_use_case";
import DialogSelector from "@/base/persention/Dialogs/dialog_selector";
import errorImage from "@/assets/images/error.png";

export default class DeleteClientController extends ControllerInterface<ClientModel> {
  private static instance: DeleteClientController;
  private constructor() {
    super();
  }
  private DeleteClientUseCase = new DeleteClientUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteClientController();
    }
    return this.instance;
  }

  async deleteClient(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<ClientModel> =
        await this.DeleteClientUseCase.call(params);

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
