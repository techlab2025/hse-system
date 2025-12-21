import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowScopeRepo } from '../repositories/showScopeRepo'
import type ScopeDetailsModel from '../../Data/models/ScopeDetailsModel'


export default class ShowScopeUseCase
  implements UseCase<ScopeDetailsModel, Params> {
  async call(params: Params): Promise<DataState<ScopeDetailsModel>> {
    return ShowScopeRepo.getInstance().call(params)
  }
}
