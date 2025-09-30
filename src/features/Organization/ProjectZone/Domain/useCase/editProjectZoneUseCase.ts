import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import { EditProjectZoneRepo } from '../repositories/editProjectZoneRepo'





export default class EditProjectZoneUseCase implements UseCase<ProjectZoneModel, Params> {
  async call(params: Params): Promise<DataState<ProjectZoneModel>> {
    return EditProjectZoneRepo.getInstance().call(params)
  }
}
