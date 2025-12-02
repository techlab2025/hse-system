import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowInvestigationMeetingRepo } from '../repositories/showInvestigationMeetingRepo'
import type InvestigationMeetingDetailsModel from '../../Data/models/investigationMeetingDetailsModel'

export default class ShowInvestigationMeetingUseCase implements UseCase<InvestigationMeetingDetailsModel, Params> {
  async call(params: Params): Promise<DataState<InvestigationMeetingDetailsModel>> {
    return ShowInvestigationMeetingRepo.getInstance().call(params)
  }
}
