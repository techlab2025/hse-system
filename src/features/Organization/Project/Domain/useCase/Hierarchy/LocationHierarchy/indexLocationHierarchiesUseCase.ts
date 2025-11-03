import type Params from "@/base/core/params/params";
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from "@/base/Domain/UseCase/use_case";
import type { DataState } from "@/base/core/networkStructure/Resources/dataState/data_state";
import { IndexLocationHierarchyRepo } from "../../../repositories/Hierarchy/LocationHierarchy/indexLocationHierarchiesRepo";
import type LocationHierarchyModel from "@/features/Organization/Project/Data/models/LocationHierarchyModel";


export default class IndexLocationHierarchyUseCase
    implements UseCase<LocationHierarchyModel[], Params> {
    async call(params: Params): Promise<DataState<LocationHierarchyModel[]>> {
        return IndexLocationHierarchyRepo.getInstance().call(params);
    }
}
