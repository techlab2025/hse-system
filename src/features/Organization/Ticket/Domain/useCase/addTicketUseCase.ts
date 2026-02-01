import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TicketModel from '../../Data/models/TicketModel'
import { AddTicketRepo } from '../repositories/addTicketRepo'

export default class AddTicketUseCase implements UseCase<TicketModel, Params> {
  async call(params: Params): Promise<DataState<TicketModel>> {
    return AddTicketRepo.getInstance().call(params)
  }
}
