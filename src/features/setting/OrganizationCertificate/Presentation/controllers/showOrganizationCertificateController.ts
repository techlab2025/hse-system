import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type OrganizationCertificateDetailsModel from '../../Data/models/OrganizationCertificateDetailsModel'
import ShowOrganizationCertificateUseCase from '../../Domain/useCase/showOrganizationCertificateUseCase'

export default class ShowOrganizationCertificateController extends ControllerInterface<OrganizationCertificateDetailsModel> {
  private static instance: ShowOrganizationCertificateController

  private constructor() {
    super()
  }

  private ShowOrganizationCertificateUseCase = new ShowOrganizationCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowOrganizationCertificateController()
    }
    return this.instance
  }

  async showOrganizationCertificate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<OrganizationCertificateDetailsModel> =
      await this.ShowOrganizationCertificateUseCase.call(params)

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
