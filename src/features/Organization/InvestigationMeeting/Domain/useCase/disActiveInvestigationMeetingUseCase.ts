import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DisActiveInvestigationMeetingRepo } from '../repositories/disActiveInvestigationMeetingRepo'
import type InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'

export default class DisInvestigationMeetingUseCase implements UseCase<InvestigationMeetingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigationMeetingModel>> {
    return DisActiveInvestigationMeetingRepo.getInstance().call(params)
  }
}
