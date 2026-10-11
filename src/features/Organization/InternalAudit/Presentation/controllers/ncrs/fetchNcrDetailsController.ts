import type FetchNcrDetailsParams from '../../../Core/params/ncrs/fetchNcrDetailsParams'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type InternalAuditNcrModel from '../../../Data/models/ncrs/InternalAuditNcrModel'
import FetchNcrDetailsUseCase from '../../../Domain/useCase/ncrs/fetchNcrDetailsUseCase'

export default class FetchNcrDetailsController extends ControllerInterface<InternalAuditNcrModel> {
  private static instance: FetchNcrDetailsController
  private readonly useCase = new FetchNcrDetailsUseCase()
  private constructor() {
    super()
  }

  static getInstance() {
    return (this.instance ??= new FetchNcrDetailsController())
  }

  async getData(params: FetchNcrDetailsParams) {
    this.setLoading()
    this.setState(await this.useCase.call(params))
    return this.state
  }
}
