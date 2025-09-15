import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import ClientModel from "@/features/dashboard/users/clients/Data/models/index_client_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import AddClientUseCase from "@/features/dashboard/users/clients/Domain/use_case/add_client_use_case";
import DialogSelector from "@/base/persention/Dialogs/dialog_selector";
import successImage from "@/assets/images/success-dialog.png";
import errorImage from "@/assets/images/error.png";

export default class AddClientController extends ControllerInterface<ClientModel> {
  private static instance: AddClientController;
  private constructor() {
    super();
  }
  private AddClientUseCase = new AddClientUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddClientController();
    }
    return this.instance;
  }

  async addClient(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<ClientModel> =
        await this.AddClientUseCase.call(params);
      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Added was successful",
          imageElement: successImage,
          messageContent: null,
        });

        // console.log(this.state.value.data)
        // console.log(draft)
        if (!draft) await router.push("/users/clients/All");

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: "dialog",
          titleContent: this.state.value.error?.title ?? "Ann Error Occurred",
          imageElement: errorImage,
          messageContent: null,
        });
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: "dialog",
        titleContent: this.state.value.error?.title,
        imageElement: errorImage,
        messageContent: null,
      });
    }

    super.handleResponseDialogs();
    return this.state;
  }
}
