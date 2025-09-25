import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HashtagModel from '../../Data/models/PrivacyModel'
import { DeleteHashtagRepo } from '../repositories/deleteHashtagRepo'

export default class DeleteHashtagUseCase implements UseCase<HashtagModel, Params> {
  async call(params: Params): Promise<DataState<HashtagModel>> {
    return DeleteHashtagRepo.getInstance().call(params)
  }
}
