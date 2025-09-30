import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectZoneModel from '../../Data/models/ProjectZoneModel'
import { AddProjectZoneRepo } from '../repositories/addProjectZoneRepo'





export default class AddProjectZoneUseCase implements UseCase<ProjectZoneModel, Params> {
  async call(params: Params): Promise<DataState<ProjectZoneModel>> {
    return AddProjectZoneRepo.getInstance().call(params)
  }
}
