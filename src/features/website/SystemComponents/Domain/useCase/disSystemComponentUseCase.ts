import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemComponentModel from '../../Data/models/SystemComponentModel'
import { DisActiveSystemComponentRepo } from '../repositories/disActiveSystemComponentRepo'

export default class DisSystemComponentUseCase implements UseCase<SystemComponentModel, Params> {
  async call(params: Params): Promise<DataState<SystemComponentModel>> {
    return DisActiveSystemComponentRepo.getInstance().call(params)
  }
}
