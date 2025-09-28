import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type OurSystemStepDetailsModel from '../../Data/models/OurSystemStepDetailsModel'
import { ShowOurSystemStepRepo } from '../repositories/showOurSystemStepRepo'


export default class ShowOurSystemStepUseCase
  implements UseCase<OurSystemStepDetailsModel, Params> {
  async call(params: Params): Promise<DataState<OurSystemStepDetailsModel>> {
    return ShowOurSystemStepRepo.getInstance().call(params)
  }
}
