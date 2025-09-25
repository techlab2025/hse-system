import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HeaderDetailsModel from '../../Data/models/HeaderDetailsModel'
import { ShowHeaderRepo } from '../repositories/showHeaderRepo'



export default class ShowHeaderUseCase
  implements UseCase<HeaderDetailsModel, Params> {
  async call(params: Params): Promise<DataState<HeaderDetailsModel>> {
    return ShowHeaderRepo.getInstance().call(params)
  }
}
