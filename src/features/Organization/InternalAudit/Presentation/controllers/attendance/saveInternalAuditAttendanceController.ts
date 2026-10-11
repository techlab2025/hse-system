import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import SaveInternalAuditAttendanceUseCase from '../../../Domain/useCase/attendance/saveInternalAuditAttendanceUseCase'

export default class SaveInternalAuditAttendanceController extends ControllerInterface<InternalAuditAttendanceModel> {
  private static instance: SaveInternalAuditAttendanceController
  private readonly useCase = new SaveInternalAuditAttendanceUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new SaveInternalAuditAttendanceController())
  }

  async save(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
