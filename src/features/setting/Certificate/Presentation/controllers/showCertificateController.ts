import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type CertificateDetailsModel from '../../Data/models/CertificateDetailsModel'
import ShowCertificateUseCase from '../../Domain/useCase/showCertificateUseCase'

export default class ShowCertificateController extends ControllerInterface<CertificateDetailsModel> {
  private static instance: ShowCertificateController

  private constructor() {
    super()
  }

  private ShowCertificateUseCase = new ShowCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCertificateController()
    }
    return this.instance
  }

  async showCertificate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<CertificateDetailsModel> =
      await this.ShowCertificateUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
