import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditNcrDetailsModel from '../../../Data/models/ncrs/InternalAuditNcrDetailsModel'
import FetchNcrDetailsUseCase from '../../../Domain/useCase/ncrs/fetchNcrDetailsUseCase'

export default class FetchNcrDetailsController extends ControllerInterface<InternalAuditNcrDetailsModel> {
  private static instance: FetchNcrDetailsController
  private readonly useCase = new FetchNcrDetailsUseCase()
  private constructor() {
    super()
  }

  static getInstance() {
    return (this.instance ??= new FetchNcrDetailsController())
  }

  async getData(params: Params) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
