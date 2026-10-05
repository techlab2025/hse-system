import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditAttendanceModel from '../../../Data/models/attendance/InternalAuditAttendanceModel'
import AddInternalAuditParticipantsUseCase from '../../../Domain/useCase/attendance/addInternalAuditParticipantsUseCase'

export default class AddInternalAuditParticipantsController extends ControllerInterface<InternalAuditAttendanceModel> {
  private static instance: AddInternalAuditParticipantsController
  private readonly useCase = new AddInternalAuditParticipantsUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    return (this.instance ??= new AddInternalAuditParticipantsController())
  }

  async add(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
