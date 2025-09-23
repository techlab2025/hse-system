import { ControllerInterface } from "@/base/Presentation/Controller/controller_interface";
import ClientModel from "@/features/users/clients/Data/models/index_client_model";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type Params from "@/base/core/params/params";
import IndexClientUseCase from "@/features/users/clients/Domain/useCase/index_clients_use_case";
import { SelectControllerInterface } from "@/base/Presentation/Controller/select_controller_interface";
import TitleInterface from "@/base/Data/Models/title_interface";

export default class IndexClientController extends SelectControllerInterface<
  ClientModel[]
> {
  private static instance: IndexClientController;
  private constructor() {
    super();
  }
  private IndexClientUseCase = new IndexClientUseCase();

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexClientController();
    }
    return this.instance;
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading();
    const dataState: DataState<ClientModel[]> =
      await this.IndexClientUseCase.call(params);

    this.setState(dataState);
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error("Error while addServices");
    }
    super.handleResponseDialogs();
    return this.state;
  }

  override async fetch(params: Params) {
    const data = await this.getData(params);
    const adaptData: any[] = [];
    if (this.isDataSuccess()) {
      (data.value.data ?? []).map((el: any) =>
        adaptData.push(
          new TitleInterface({
            id: el?.id,
            title: el?.code + " - " + el?.name,
            // subtitle: el?.type || 0,
            subtitle: el?.type || 0,
            decodedData: JSON.stringify({
              projectCount: el?.projectCount,
              responsable: el?.responsable,
            }),
            // subtitle: '1'
          }),
        ),
      );
    }
    // console.log(adaptData)
    // console.log(adaptData[0] , "inner");
    return adaptData;
  }
}
