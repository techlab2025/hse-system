import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
import LangModel from "@/features/setting/languages/Data/models/langModel";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import EditLangUseCase from "@/features/setting/languages/Domain/useCase/editLangUseCase";
import DialogSelector from "@/base/Presentation/Dialogs/dialog_selector";
import successImage from "@/assets/images/Success.png";
import errorImage from "@/assets/images/Error.png";

export default class EditLangController extends ControllerInterface<LangModel> {
  private static instance: EditLangController;

  private constructor() {
    super();
  }

  private EditLangUseCase = new EditLangUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditLangController();
    }
    return this.instance;
  }

  async editLang(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<LangModel> =
        await this.EditLangUseCase.call(params);

      this.setState(dataState);
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Added was successful",
          imageElement: successImage,
          messageContent: null,
        });
        if (!draft) await router.push("/users/languages");
        // console.log(this.state.value.data)
        await router.push("/users/languages/All"); // useLoaderStore().endLoadingWithDialog();
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
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      });
    }
    return this.state;
  }
}
