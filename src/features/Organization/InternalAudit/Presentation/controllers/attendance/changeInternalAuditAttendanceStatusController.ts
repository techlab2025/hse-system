import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import ChangeInternalAuditAttendanceStatusUseCase from '../../../Domain/useCase/attendance/changeInternalAuditAttendanceStatusUseCase'

export default class ChangeInternalAuditAttendanceStatusController extends ControllerInterface<InternalAuditAttendanceModel> {
  private static instance: ChangeInternalAuditAttendanceStatusController
  private readonly useCase = new ChangeInternalAuditAttendanceStatusUseCase()
  private constructor() { super() }
  static getInstance() { return (this.instance ??= new ChangeInternalAuditAttendanceStatusController()) }

  async changeStatus(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
