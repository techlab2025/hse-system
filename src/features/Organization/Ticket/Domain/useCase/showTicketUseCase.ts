import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TicketDetailsModel from '../../Data/models/TicketDetailsModel'
import { ShowTicketRepo } from '../repositories/showTicketRepo'

export default class ShowTicketUseCase implements UseCase<TicketDetailsModel, Params> {
  async call(params: Params): Promise<DataState<TicketDetailsModel>> {
    return ShowTicketRepo.getInstance().call(params)
  }
}
