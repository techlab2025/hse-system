import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowEquipmentTypeRepo } from '@/features/setting/EquipmentType/Domain/repositories/showEquipmentTypeRepo'
import EquipmentTypeDetailsModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeDetailsModel.ts'

export default class ShowEquipmentTypeUseCase
  implements UseCase<EquipmentTypeDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<EquipmentTypeDetailsModel>> {
    return ShowEquipmentTypeRepo.getInstance().call(params)
  }
}
