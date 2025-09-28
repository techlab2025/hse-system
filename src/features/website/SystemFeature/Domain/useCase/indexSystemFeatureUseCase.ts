import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemFeatureModel from '../../Data/models/SystemFeatureModel'
import { IndexSystemFeatureRepo } from '../repositories/indexSystemFeatureRepo'

export default class IndexSystemFeatureUseCase implements UseCase<SystemFeatureModel[], Params> {
  async call(params: Params): Promise<DataState<SystemFeatureModel[]>> {
    return IndexSystemFeatureRepo.getInstance().call(params)
  }
}
