import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddScopeRepo } from '../repositories/addScopeRepo'
import type ScopeModel from '../../Data/models/ScopeModel'

export default class AddScopeteUseCase implements UseCase<ScopeModel, Params> {
  async call(params: Params): Promise<DataState<ScopeModel>> {
    return AddScopeRepo.getInstance().call(params)
  }
}
