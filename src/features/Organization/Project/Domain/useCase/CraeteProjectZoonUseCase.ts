import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectModel from '../../Data/models/ProjectModel'
import { CreateProjectZoneRepo } from '../repositories/CreateProjectZoneRepo'

export default class CreateProjectZoonUseCase implements UseCase<ProjectModel, Params> {
  async call(params: Params): Promise<DataState<ProjectModel>> {
    return CreateProjectZoneRepo.getInstance().call(params)
  }
}
