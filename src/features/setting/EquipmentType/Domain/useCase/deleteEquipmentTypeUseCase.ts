import type Params from '@/base/core/params/params'
import type EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteEquipmentTypeRepo } from '@/features/setting/EquipmentType/Domain/repositories/deleteEquipmentTypeRepo'

export default class DeleteEquipmentTypeUseCase implements UseCase<EquipmentTypeModel, Params> {
  async call(params: Params): Promise<DataState<EquipmentTypeModel>> {
    return DeleteEquipmentTypeRepo.getInstance().call(params)
  }
}
