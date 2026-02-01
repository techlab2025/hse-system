import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TicketTypeModel from '../../Data/models/TicketTypeModel'
import { IndexTicketTypeRepo } from '../repositories/indexTicketTypeRepo'

export default class IndexTicketTypeUseCase implements UseCase<TicketTypeModel[], Params> {
  async call(params: Params): Promise<DataState<TicketTypeModel[]>> {
    return IndexTicketTypeRepo.getInstance().call(params)
  }
}
