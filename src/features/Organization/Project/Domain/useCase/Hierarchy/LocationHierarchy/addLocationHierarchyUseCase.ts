import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddLocationHierarchyRepo } from '../../../repositories/Hierarchy/LocationHierarchy/addLocationHierarchyRepo'
import type LocationHierarchyModel from '@/features/Organization/Project/Data/models/LocationHierarchyModel'



export default class AddLocationHierarchyUseCase implements UseCase<LocationHierarchyModel, Params> {
  async call(params: Params): Promise<DataState<LocationHierarchyModel>> {
    return AddLocationHierarchyRepo.getInstance().call(params)
  }
}
