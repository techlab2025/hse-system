import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HazardTypeModel from '@/features/setting/HazardType/Data/models/hazardTypeModel'
import { AddSystemHazardTypeRepo } from '../repositories/addSystemHazardTypeRepo'

export default class AddSystemHazardTypeUseCase implements UseCase<HazardTypeModel, Params> {
  async call(params: Params): Promise<DataState<HazardTypeModel>> {
    return AddSystemHazardTypeRepo.getInstance().call(params)
  }
}
