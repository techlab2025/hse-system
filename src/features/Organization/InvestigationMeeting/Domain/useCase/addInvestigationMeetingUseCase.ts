import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { AddInvestigationMeetingRepo } from '../repositories/addInvestigationMeetingRepo'
import type InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'
import type Params from '@/base/core/params/params'

export default class AddInvestigationMeetingUseCase implements UseCase<InvestigationMeetingModel, Params> {
  async call(params: Params): Promise<DataState<InvestigationMeetingModel>> {
    return AddInvestigationMeetingRepo.getInstance().call(params)
  }
}
