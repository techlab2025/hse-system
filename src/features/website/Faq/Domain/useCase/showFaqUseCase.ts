import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type FaqDetailsModel from '../../Data/models/FaqDetailsModel'
import { ShowFaqRepo } from '../repositories/showFaqRepo'


export default class ShowFaqUseCase
  implements UseCase<FaqDetailsModel, Params> {
  async call(params: Params): Promise<DataState<FaqDetailsModel>> {
    return ShowFaqRepo.getInstance().call(params)
  }
}
