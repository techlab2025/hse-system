import type Params from '@/base/core/params/params'
import type HealthConditionsModel from '@/features/setting/HealthConditions/Data/models/healthConditionsModel'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteHealthConditionsRepo } from '@/features/setting/HealthConditions/Domain/repositories/deleteHealthConditionsRepo'

export default class DeleteHealthConditionsUseCase implements UseCase<HealthConditionsModel, Params> {
  async call(params: Params): Promise<DataState<HealthConditionsModel>> {
    return DeleteHealthConditionsRepo.getInstance().call(params)
  }
}
