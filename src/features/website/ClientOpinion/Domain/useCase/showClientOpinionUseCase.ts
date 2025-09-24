import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ClientOpinionDetailsModel from '../../Data/models/ClientOpinionDetailsModel'
import { ShowClientOpinionRepo } from '../repositories/showClientOpinionRepo'


export default class ShowClientOpinionUseCase
  implements UseCase<ClientOpinionDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<ClientOpinionDetailsModel>> {
    return ShowClientOpinionRepo.getInstance().call(params)
  }
}
