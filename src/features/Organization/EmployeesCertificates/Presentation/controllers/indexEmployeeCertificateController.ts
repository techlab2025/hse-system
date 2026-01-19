// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexEmployeeCertificateUseCase from '../../Domain/useCase/indexEmployeeCertificateUseCase'
import type OrganizatoinEmployeeModel from '@/features/Organization/OrganizationEmployee/Data/models/OrganizatoinEmployeeModel'

export default class IndexEmployeeCertificateController extends SelectControllerInterface<
  OrganizatoinEmployeeModel[]
> {
  private static instance: IndexEmployeeCertificateController
  private constructor() {
    super()
  }
  private indexEmployeeCertificateUseCase = new IndexEmployeeCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexEmployeeCertificateController()
    }
    return this.instance
  }

  async getData(params: Params) {
    this.setLoading()
    const dataState: DataState<OrganizatoinEmployeeModel[]> =
      await this.indexEmployeeCertificateUseCase.call(params)

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
