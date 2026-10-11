import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ProjectModel from '../../../Data/models/ProjectModel'
import { PermitToWorkResultRepo } from '../../repositories/PermitToWork/PermitToWorkResultRepo'
import type PermitStaticsModel from '../../../Data/models/PermitToWork/PermitStaticsModel'
import { PermitStaticsToWorkRepo } from '../../repositories/PermitToWork/PermitStaticsToWorkRepo'

export default class PermitStaticsToWorkResultUseCase implements UseCase<PermitStaticsModel, Params> {
  async call(params: Params): Promise<DataState<PermitStaticsModel>> {
    return PermitStaticsToWorkRepo.getInstance().call(params)
  }
}
 