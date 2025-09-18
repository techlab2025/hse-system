import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import DeleteLangUseCase from "@/features/setting/languages/Domain/useCase/deleteLangUseCase.ts";
import DialogSelector from "@/base/persention/Dialogs/dialog_selector";
import errorImage from "@/assets/images/error.png";

export default class DeleteLangController extends ControllerInterface<LangModel> {
  private static instance: DeleteLangController;
  private constructor() {
    super();
  }
  private DeleteLangUseCase = new DeleteLangUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteLangController();
    }
    return this.instance;
  }

  async deleteLang(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<LangModel> =
        await this.DeleteLangUseCase.call(params);

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
