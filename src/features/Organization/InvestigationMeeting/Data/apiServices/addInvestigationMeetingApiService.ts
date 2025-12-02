import { ApiNames } from "@/base/core/networkStructure/apiNames";
import ServicesInterface from "@/base/Data/ApiService/api_service_interface";
import { CrudType } from "@/base/core/params/call_params_interface";
import type Params from "@/base/core/params/params";

class AddInvestigationMeetingApiService extends ServicesInterface {
  private static instance: AddInvestigationMeetingApiService;

  private constructor() {
    super(); // Ensure this does not call any uninitialized methods or properties
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInvestigationMeetingApiService();
    }
    return this.instance;
  }

  async applyService(
    params: Params,
  ): Promise<{ data: any; statusCode: number }> {
    return await super.call({
      url: ApiNames.instance.CreateInvestigationMeeting,
      type: CrudType.FormData,
      auth: true,
      params: params,
      showLoadingDialog: true,
    });
  }
}

export { AddInvestigationMeetingApiService };
