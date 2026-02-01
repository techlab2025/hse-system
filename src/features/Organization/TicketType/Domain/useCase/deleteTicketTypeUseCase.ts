import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TicketTypeModel from '../../Data/models/TicketTypeModel'
import { DeleteTicketTypeRepo } from '../repositories/deleteTicketTypeRepo'

export default class DeleteTicketTypeUseCase implements UseCase<TicketTypeModel, Params> {
  async call(params: Params): Promise<DataState<TicketTypeModel>> {
    return DeleteTicketTypeRepo.getInstance().call(params)
  }
}
