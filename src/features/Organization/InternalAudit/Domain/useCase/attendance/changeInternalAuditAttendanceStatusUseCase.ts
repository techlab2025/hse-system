import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import ChangeInternalAuditAttendanceStatusRepo from '../../repositories/attendance/changeInternalAuditAttendanceStatusRepo'

export default class ChangeInternalAuditAttendanceStatusUseCase implements UseCase<InternalAuditAttendanceModel, Params> {
  async call(params: Params): Promise<DataState<InternalAuditAttendanceModel>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditAttendanceModel.example[0]! }),
      onDev: () => ChangeInternalAuditAttendanceStatusRepo.getInstance().call(params),
      onProduction: () => ChangeInternalAuditAttendanceStatusRepo.getInstance().call(params),
    })
  }
}
