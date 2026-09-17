import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { UpdateInvestigationTaskRepo } from '../../repositories/InvestigationTasks/UpdateInvestigationTaskRepo'

export default class UpdateInvestigationTaskUseCase implements UseCase<void, Params> {
  async call(params: Params): Promise<DataState<void>> {
    return UpdateInvestigationTaskRepo.getInstance().call(params)
  }
}
