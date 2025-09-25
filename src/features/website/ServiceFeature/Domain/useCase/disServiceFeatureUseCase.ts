import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveServiceFeatureRepo } from '../repositories/disActiveServiceFeatureRepo'
import type ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'

export default class DisServiceFeatureUseCase implements UseCase<ServiceFeatureModel, Params> {
  async call(params: Params): Promise<DataState<ServiceFeatureModel>> {
    return DisActiveServiceFeatureRepo.getInstance().call(params)
  }
}
