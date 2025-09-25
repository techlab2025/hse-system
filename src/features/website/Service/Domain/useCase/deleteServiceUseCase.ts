import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceModel from '../../Data/models/ServiceModel'
import { DeleteServiceRepo } from '../repositories/deleteServiceRepo'


export default class DeleteServiceUseCase implements UseCase<ServiceModel, Params> {
  async call(params: Params): Promise<DataState<ServiceModel>> {
    return DeleteServiceRepo.getInstance().call(params)
  }
}
