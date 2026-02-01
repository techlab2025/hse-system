import type Params from '@/base/core/params/params'
// import type ShowLangModel from "@/features/setting/languages/Data/models/langDetailsModel";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import { ShowTicketTypeRepo } from '../repositories/showTicketTypeRepo'
import type TicketTypeDetailsModel from '../../Data/models/TicketTypeDetailsModel'

export default class ShowTicketTypeUseCase implements UseCase<TicketTypeDetailsModel, Params> {
  async call(params: Params): Promise<DataState<TicketTypeDetailsModel>> {
    return ShowTicketTypeRepo.getInstance().call(params)
  }
}
