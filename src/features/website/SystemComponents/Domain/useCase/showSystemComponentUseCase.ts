import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemComponentDetailsModel from '../../Data/models/SystemComponentDetailsModel'
import { ShowSystemComponentRepo } from '../repositories/showSystemComponentRepo'

export default class ShowSystemComponentUseCase
  implements UseCase<SystemComponentDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<SystemComponentDetailsModel>> {
    return ShowSystemComponentRepo.getInstance().call(params)
  }
}
