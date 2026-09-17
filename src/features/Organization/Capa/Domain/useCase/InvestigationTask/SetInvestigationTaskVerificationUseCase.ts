import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import SetInvestigationTaskVerificationRepository from '../../repositories/InvestigationTasks/SetInvestigationTaskVerificationRepository'

export default class SetInvestigationTaskVerificationUseCase implements UseCase<void, Params> {
  call(params: Params): Promise<DataState<void>> {
    return SetInvestigationTaskVerificationRepository.getInstance().call(params)
  }
}
