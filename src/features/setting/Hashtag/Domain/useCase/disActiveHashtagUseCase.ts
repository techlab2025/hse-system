import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HashtagModel from '../../Data/models/HashtagModel'
import { DisActiveHashtagRepo } from '../repositories/disActiveHashtagRepo'


export default class DisHashtagUseCase implements UseCase<HashtagModel, Params> {
  async call(params: Params): Promise<DataState<HashtagModel>> {
    return DisActiveHashtagRepo.getInstance().call(params)
  }
}
