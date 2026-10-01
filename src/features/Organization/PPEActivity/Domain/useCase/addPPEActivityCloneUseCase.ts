import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PPEActivityModel from '../../Data/models/PPEActivityModel'
import { AddPPEActivityCloneRepo } from '../repositories/AddPPEActivityCloneRepo'

export default class AddPPEActivityCloneUseCase implements UseCase<PPEActivityModel, Params> {
  async call(params: Params): Promise<DataState<PPEActivityModel>> {
    return AddPPEActivityCloneRepo.getInstance().call(params)
  }
}
