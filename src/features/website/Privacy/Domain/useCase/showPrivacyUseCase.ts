import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type PrivacyDetailsModel from '../../Data/models/PrivacyDetailsModel'
import { ShowPrivacyRepo } from '../repositories/showPrivacyRepo'


export default class ShowPrivacyUseCase
  implements UseCase<PrivacyDetailsModel, Params> {
  async call(params: Params): Promise<DataState<PrivacyDetailsModel>> {
    return ShowPrivacyRepo.getInstance().call(params)
  }
}
