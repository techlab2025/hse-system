import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { EditEquipmentTypeRepo } from '@/features/setting/EquipmentType/Domain/repositories/editEquipmentTypeRepo'
import type EquipmentTypeModel from '@/features/setting/EquipmentType/Data/models/equipmentTypeModel.ts'
import { EditRootCausesRepo } from '../repositories/editRootCausesRepo'
import type RootCausesModel from '../../Data/models/RootCausesModel'

export default class EditRootCausesUseCase implements UseCase<RootCausesModel, Params> {
  async call(params: Params): Promise<DataState<RootCausesModel>> {
    return EditRootCausesRepo.getInstance().call(params)
  }
}
