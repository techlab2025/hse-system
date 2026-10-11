import {
  DataSuccess,
  type DataState,
} from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import AddInternalAuditParticipantsRepo from '../../repositories/attendance/addInternalAuditParticipantsRepo'

export default class AddInternalAuditParticipantsUseCase
  implements UseCase<InternalAuditAttendanceModel, Params>
{
  async call(params: Params): Promise<DataState<InternalAuditAttendanceModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditAttendanceModel.example[2]! }),
      onDev: () => AddInternalAuditParticipantsRepo.getInstance().call(params),
      onProduction: () => AddInternalAuditParticipantsRepo.getInstance().call(params),
    })
  }
}
