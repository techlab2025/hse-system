import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import ShowAdminUseCase from "../../Domain/useCase/show_admin_use_case";
import type ShowAdminModel from "../../Data/models/show_Admin_model";

export default class ShowAdminController extends ControllerInterface<ShowAdminModel> {
  private static instance: ShowAdminController;

  private constructor() {
    super();
  }

  private ShowAdminUseCase = new ShowAdminUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowAdminController();
    }
    return this.instance;
  }

  async showAdmin(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading();

    const dataState: DataState<ShowAdminModel> =
      await this.ShowAdminUseCase.call(params);

    this.setState(dataState);
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error("Error while addServices");
    }
    super.handleResponseDialogs();
    return this.state;
  }
}
