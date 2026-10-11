// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type OrganizationCertificateModel from '../../Data/models/OrganizationCertificateModel'
import IndexOrganizationCertificateUseCase from '../../Domain/useCase/indexOrganizationCertificateUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexOrganizationCertificateController extends SelectControllerInterface<
  OrganizationCertificateModel[]
> {
  private static instance: IndexOrganizationCertificateController
  private constructor() {
    super()
  }
  private IndexOrganizationCertificateUseCase = new IndexOrganizationCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationCertificateController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<OrganizationCertificateModel[]> =
      await this.IndexOrganizationCertificateUseCase.call(params)

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
