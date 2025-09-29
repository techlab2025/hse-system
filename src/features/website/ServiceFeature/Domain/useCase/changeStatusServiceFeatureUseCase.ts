import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'
import { ChangeStatusServiceFeatureRepo } from '../repositories/changeStatusServiceFeatureRepo'





export default class ChangeStatusServiceFeatureUseCase implements UseCase<ServiceFeatureModel, Params> {
  async call(params: Params): Promise<DataState<ServiceFeatureModel>> {
    return ChangeStatusServiceFeatureRepo.getInstance().call(params)
  }
}
