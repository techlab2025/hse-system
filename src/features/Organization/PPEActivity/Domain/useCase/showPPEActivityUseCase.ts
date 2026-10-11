import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowPPEActivityRepo } from '../repositories/showPPEActivityRepo'
import PPEActivityDetailsModel from '../../Data/models/PPEActivityDetailsModel'

export default class ShowPPEActivityUseCase
  implements UseCase<PPEActivityDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<PPEActivityDetailsModel>> {
    return ShowPPEActivityRepo.getInstance().call(params)
  }
}
