import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { DeleteInvestigationMeetingRepo } from '../repositories/deleteInvestigationMeetingRepo'
import type InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'

export default class DeleteInvestigationMeetingUseCase implements UseCase<InvestigationMeetingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigationMeetingModel>> {
    return DeleteInvestigationMeetingRepo.getInstance().call(params)
  }
}
