import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type InjuryDetailsModel from '../../Data/models/InjuryDetailsModel'
import { ShowInjuryRepo } from '../repositories/showInjuryRepo'


export default class ShowInjuryUseCase
  implements UseCase<InjuryDetailsModel, Params> {
  async call(params: Params): Promise<DataState<InjuryDetailsModel>> {
    return ShowInjuryRepo.getInstance().call(params)
  }
}
