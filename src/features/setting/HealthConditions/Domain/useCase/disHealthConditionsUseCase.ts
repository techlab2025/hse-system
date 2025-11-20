import type Params from '@/base/core/params/params'
// import type LangModel from '@/features/setting/languages/Data/models/langModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveHealthConditionsRepo } from '@/features/setting/HealthConditions/Domain/repositories/disActiveHealthConditionsRepo'
import type HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'

export default class DisHealthConditionsUseCase implements UseCase<HealthConditionsModel, Params> {
  async call(params: Params): Promise<DataState<HealthConditionsModel>> {
    return DisActiveHealthConditionsRepo.getInstance().call(params)
  }
}
