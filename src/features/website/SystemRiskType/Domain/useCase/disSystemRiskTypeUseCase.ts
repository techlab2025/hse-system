import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type SystemRiskTypeModel from '../../Data/models/SystemRiskTypeModel'
import { DisActiveSystemRiskTypeRepo } from '../repositories/disActiveSystemRiskTypeRepo'

export default class DisSystemRiskTypeUseCase implements UseCase<SystemRiskTypeModel, Params> {
  async call(params: Params): Promise<DataState<SystemRiskTypeModel>> {
    return DisActiveSystemRiskTypeRepo.getInstance().call(params)
  }
}
