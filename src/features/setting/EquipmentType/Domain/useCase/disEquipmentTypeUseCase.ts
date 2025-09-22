import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveEquipmentTypeRepo } from '@/features/setting/EquipmentType/Domain/repositories/disActiveEquipmentTypeRepo'
import type EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'

export default class DisEquipmentTypeUseCase implements UseCase<EquipmentTypeModel, Params> {
  async call(params: Params): Promise<DataState<EquipmentTypeModel>> {
    return DisActiveEquipmentTypeRepo.getInstance().call(params)
  }
}
