import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeContactUsDetailsModel from '../../Data/models/HomeContactUsDetailsModel'
import { ShowHomeContactUsRepo } from '../repositories/showHomeContactUsRepo'



export default class ShowHomeContactUsUseCase
  implements UseCase<HomeContactUsDetailsModel, Params> {
  async call(params: Params): Promise<DataState<HomeContactUsDetailsModel>> {
    return ShowHomeContactUsRepo.getInstance().call(params)
  }
}
