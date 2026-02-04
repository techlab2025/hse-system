import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type TicketModel from '../../Data/models/TicketModel'
import { CloseTicketRepo } from '../repositories/CloseTicketRepo'


export default class CloseTicketUseCase implements UseCase<TicketModel, Params> {
    async call(params: Params): Promise<DataState<TicketModel>> {
        return CloseTicketRepo.getInstance().call(params)
    }
}
