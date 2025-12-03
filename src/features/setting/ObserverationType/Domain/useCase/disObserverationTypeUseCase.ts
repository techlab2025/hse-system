import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveObserverationTypeRepo } from '@/features/setting/ObserverationType/Domain/repositories/disActiveObserverationTypeRepo'
import type ObserverationTypeModel from '@/features/setting/ObserverationType/Data/models/observerationTypeModel'

export default class DisObserverationTypeUseCase implements UseCase<ObserverationTypeModel, Params> {
  async call(params: Params): Promise<DataState<ObserverationTypeModel>> {
    return DisActiveObserverationTypeRepo.getInstance().call(params)
  }
}
