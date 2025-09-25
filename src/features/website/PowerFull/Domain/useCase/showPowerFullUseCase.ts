import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PowerFullDetailsModel from '../../Data/models/PowerFullDetailsModel'
import { ShowPowerFullRepo } from '../repositories/showPowerFullRepo'



export default class ShowPowerFullUseCase
  implements UseCase<PowerFullDetailsModel, Params> {
  async call(params: Params): Promise<DataState<PowerFullDetailsModel>> {
    return ShowPowerFullRepo.getInstance().call(params)
  }
}
