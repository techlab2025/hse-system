import { DataSuccess, type DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type UseCase from '@/base/Domain/UseCase/use_case'
import { UseCaseHandler } from '@/base/Domain/UseCase/use_case'
import InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import FetchInternalAuditAttendanceRepo from '../../repositories/attendance/fetchInternalAuditAttendanceRepo'

export default class FetchInternalAuditAttendanceUseCase implements UseCase<InternalAuditAttendanceModel[], Params> {
  async call(params: Params): Promise<DataState<InternalAuditAttendanceModel[]>> {
    return UseCaseHandler.instance().handle({
      onTest: () => new DataSuccess({ data: InternalAuditAttendanceModel.example }),
      onDev: () => FetchInternalAuditAttendanceRepo.getInstance().call(params),
      onProduction: () => FetchInternalAuditAttendanceRepo.getInstance().call(params),
    })
  }
}
