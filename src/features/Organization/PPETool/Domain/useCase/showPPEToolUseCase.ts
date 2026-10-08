import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowPPEToolRepo } from '../repositories/showPPEToolRepo'
import PPEToolDetailsModel from '../../Data/models/PPEToolDetailsModel'

export default class ShowPPEToolUseCase
  implements UseCase<PPEToolDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<PPEToolDetailsModel>> {
    return ShowPPEToolRepo.getInstance().call(params)
  }
}
