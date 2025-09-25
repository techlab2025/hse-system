import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HomeAboutUsDetailsModel from '../../Data/models/HomeAboutUsDetailsModel'
import { ShowHomeAboutUsRepo } from '../repositories/showHomeAboutUsRepo'



export default class ShowHomeAboutUsUseCase
  implements UseCase<HomeAboutUsDetailsModel, Params>
{
  async call(params: Params): Promise<DataState<HomeAboutUsDetailsModel>> {
    return ShowHomeAboutUsRepo.getInstance().call(params)
  }
}
