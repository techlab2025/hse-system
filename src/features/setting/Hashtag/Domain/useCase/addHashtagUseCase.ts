import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type HashtagteModel from '../../Data/models/HashtagModel'
import { AddHashtagRepo } from '../repositories/addHashtagRepo'


export default class AddHashtagteUseCase implements UseCase<HashtagteModel, Params> {
  async call(params: Params): Promise<DataState<HashtagteModel>> {
    return AddHashtagRepo.getInstance().call(params)
  }
}
