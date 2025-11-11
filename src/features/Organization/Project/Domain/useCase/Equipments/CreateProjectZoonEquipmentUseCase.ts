import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectModel from '../../Data/models/ProjectModel'
import { CreateProjectZoneEquipmentRepo } from '../../repositories/Equipments/CreateProjectZoneEquipmentRepo'

export default class CreateProjectZoonEquipmentUseCase implements UseCase<ProjectModel, Params> {
  async call(params: Params): Promise<DataState<ProjectModel>> {
    return CreateProjectZoneEquipmentRepo.getInstance().call(params)
  }
}
