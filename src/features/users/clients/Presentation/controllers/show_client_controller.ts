import { ControllerInterface } from "@/base/persention/Controller/controller_interface";
import ShowClientModel from "@/features/dashboard/users/clients/Data/models/show_client_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import ShowClientUseCase from "@/features/dashboard/users/clients/Domain/use_case/show_client_use_case";

export default class ShowClientController extends ControllerInterface<ShowClientModel> {
  private static instance: ShowClientController;

  private constructor() {
    super();
  }

  private ShowClientUseCase = new ShowClientUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowClientController();
    }
    return this.instance;
  }

  async showClient(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading();

    const dataState: DataState<ShowClientModel> =
      await this.ShowClientUseCase.call(params);

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
