import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import type CategoryModel from "../../Data/models/CategoryModel";
import { IndexCategoryRepo } from "../repositories/indexCategoryRepo";


export default class IndexCategoryUseCase
  implements UseCase<CategoryModel[], Params> {
  async call(params: Params): Promise<DataState<CategoryModel[]>> {
    return IndexCategoryRepo.getInstance().call(params);
  }
}
