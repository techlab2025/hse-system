import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteServiceFeatureRepo } from '../repositories/deleteServiceFeatureRepo'
import type ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'

export default class DeleteServiceFeatureUseCase implements UseCase<ServiceFeatureModel, Params> {
  async call(params: Params): Promise<DataState<ServiceFeatureModel>> {
    return DeleteServiceFeatureRepo.getInstance().call(params)
  }
}
