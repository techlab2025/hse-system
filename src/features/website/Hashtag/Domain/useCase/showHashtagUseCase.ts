import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HashtagDetailsModel from '../../Data/models/HashtagDetailsModel'
import { ShowHashtagRepo } from '../repositories/showHashtagRepo'


export default class ShowHashtagUseCase
  implements UseCase<HashtagDetailsModel, Params> {
  async call(params: Params): Promise<DataState<HashtagDetailsModel>> {
    return ShowHashtagRepo.getInstance().call(params)
  }
}
