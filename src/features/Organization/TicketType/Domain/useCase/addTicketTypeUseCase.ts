import type Params from '@/base/core/params/params'
// import type LangModel from "@/features/setting/languages/Data/models/langModel.ts";
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TicketTypeModel from '../../Data/models/TicketTypeModel'
import { AddTicketTypeRepo } from '../repositories/addTicketTypeRepo'

export default class AddTicketTypeUseCase implements UseCase<TicketTypeModel, Params> {
  async call(params: Params): Promise<DataState<TicketTypeModel>> {
    return AddTicketTypeRepo.getInstance().call(params)
  }
}
