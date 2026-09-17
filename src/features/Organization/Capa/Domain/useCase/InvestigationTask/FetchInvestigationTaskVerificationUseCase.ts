import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import FetchInvestigationTaskVerificationRepository from '../../repositories/InvestigationTasks/FetchInvestigationTaskVerificationRepository'
import type FetchInvestigationTaskVerificationModel from '../../../Data/models/FetchInvestigationTaskVerificationModel'

export default class FetchInvestigationTaskVerificationUseCase
  implements UseCase<FetchInvestigationTaskVerificationModel, Params>
{
  async call(params: Params): Promise<DataState<FetchInvestigationTaskVerificationModel>> {
    return FetchInvestigationTaskVerificationRepository.getInstance().call(params)
  }
}
