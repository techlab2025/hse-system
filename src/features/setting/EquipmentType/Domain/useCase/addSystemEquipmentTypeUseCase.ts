import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddSystemEquipmentTypeRepo } from '@/features/setting/EquipmentType/Domain/repositories/addSystemEquipmentTypeRepo.ts'
import type EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'

export default class AddSystemEquipmentTypeUseCase implements UseCase<EquipmentTypeModel, Params> {
  async call(params: Params): Promise<DataState<EquipmentTypeModel>> {
    return AddSystemEquipmentTypeRepo.getInstance().call(params)
  }
}
