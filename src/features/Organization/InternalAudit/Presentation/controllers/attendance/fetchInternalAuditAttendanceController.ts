import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import FetchInternalAuditAttendanceUseCase from '../../../Domain/useCase/attendance/fetchInternalAuditAttendanceUseCase'

export default class FetchInternalAuditAttendanceController extends ControllerInterface<InternalAuditAttendanceModel[]> {
  private static instance: FetchInternalAuditAttendanceController
  private readonly useCase = new FetchInternalAuditAttendanceUseCase()
  private constructor() { super([]) }
  static getInstance() { return (this.instance ??= new FetchInternalAuditAttendanceController()) }

  async fetch(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
