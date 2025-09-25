import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TermDetailsModel from '../../Data/models/TermDetailsModel'
import { ShowTermRepo } from '../repositories/showTermRepo'


export default class ShowTermUseCase
  implements UseCase<TermDetailsModel, Params> {
  async call(params: Params): Promise<DataState<TermDetailsModel>> {
    return ShowTermRepo.getInstance().call(params)
  }
}
