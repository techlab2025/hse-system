import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HerikalyDetailsModel from '../../Data/models/HerikalyDetailsModel'
import { ShowHerikalyRepo } from '../repositories/showHerikalyRepo'



export default class ShowHerikalyUseCase
  implements UseCase<HerikalyDetailsModel, Params> {
  async call(params: Params): Promise<DataState<HerikalyDetailsModel>> {
    return ShowHerikalyRepo.getInstance().call(params)
  }
}
