import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PartnerDetailsModel from '../../Data/models/PartnerDetailsModel'
import { ShowPartnerRepo } from '../repositories/showPartnerRepo'


export default class ShowPartnerUseCase
  implements UseCase<PartnerDetailsModel, Params> {
  async call(params: Params): Promise<DataState<PartnerDetailsModel>> {
    return ShowPartnerRepo.getInstance().call(params)
  }
}
