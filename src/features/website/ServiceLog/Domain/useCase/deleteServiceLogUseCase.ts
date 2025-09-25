import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type ServiceLogModel from '../../Data/models/ServiceLogModel'
import { DeleteServiceLogRepo } from '../repositories/deleteServiceLogRepo'

export default class DeleteServiceLogUseCase implements UseCase<ServiceLogModel, Params> {
  async call(params: Params): Promise<DataState<ServiceLogModel>> {
    return DeleteServiceLogRepo.getInstance().call(params)
  }
}
