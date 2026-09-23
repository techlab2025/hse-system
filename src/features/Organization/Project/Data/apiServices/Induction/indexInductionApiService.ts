import { ApiNames } from "@/base/core/networkStructure/apiNames";
import ServicesInterface from "@/base/Data/ApiService/api_service_interface";
import { CrudType } from "@/base/core/params/call_params_interface";
import type Params from "@/base/core/params/params";

class IndexInductionApiService extends ServicesInterface {
  private static instance: IndexInductionApiService;

  private constructor() {
    super(); // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInductionApiService();
    }
    return this.instance;
  }

  async applyService(
    params: Params,
  ): Promise<{ data: unknown; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.fetch_inductions,
      type: CrudType.POST,
      auth: true,
      params: params,
    });
  }
}

export { IndexInductionApiService };
