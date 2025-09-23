import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
import ClientProjectModel from "@/features/users/clients/Data/models/client_projects_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import ClientProjectUseCase from "@/features/users/clients/Domain/useCase/show_client_projects_use_case";

export default class ClientProjectController extends ControllerInterface<ClientProjectModel> {
  private static instance: ClientProjectController;

  private constructor() {
    super();
  }

  private ClientProjectUseCase = new ClientProjectUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new ClientProjectController();
    }
    return this.instance;
  }

  async fetchClientProjects(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading();

    const dataState: DataState<ClientProjectModel> =
      await this.ClientProjectUseCase.call(params);

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
