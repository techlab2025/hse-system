import type Params from '@/base/core/params/params'
import type ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteObserverationTypeRepo } from '@/features/setting/ObserverationType/Domain/repositories/deleteObserverationTypeRepo'

export default class DeleteObserverationTypeUseCase implements UseCase<ObserverationTypeModel, Params> {
  async call(params: Params): Promise<DataState<ObserverationTypeModel>> {
    return DeleteObserverationTypeRepo.getInstance().call(params)
  }
}
