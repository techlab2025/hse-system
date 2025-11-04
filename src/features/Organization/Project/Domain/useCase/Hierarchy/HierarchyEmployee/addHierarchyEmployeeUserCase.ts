import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HierarchyEmployeeModel from '@/features/Organization/Project/Data/models/LocationHierarchyEmployeeModel'
import { AddHierarchyEmployeeRepo } from '../../../repositories/Hierarchy/HierarchyEmployee/addHierarchyEmployeeRepo'



export default class AddHierarchyEmployeeUseCase implements UseCase<HierarchyEmployeeModel, Params> {
  async call(params: Params): Promise<DataState<HierarchyEmployeeModel>> {
    return AddHierarchyEmployeeRepo.getInstance().call(params)
  }
}
