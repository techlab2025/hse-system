import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemWorkDetailsModel from '../../Data/models/SystemWorkDetailsModel'
import { ShowSystemWorkRepo } from '../repositories/showSystemWorkRepo'



export default class ShowSystemWorkUseCase
  implements UseCase<SystemWorkDetailsModel, Params> {
  async call(params: Params): Promise<DataState<SystemWorkDetailsModel>> {
    return ShowSystemWorkRepo.getInstance().call(params)
  }
}
