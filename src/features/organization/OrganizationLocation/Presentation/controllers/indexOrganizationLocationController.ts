// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type OrganizationLocationModel from '../../Data/models/OrganizationLocationModel'
import IndexOrganizationLocationUseCase from '../../Domain/useCase/indexOrganizationLocationUseCase'


export default class IndexOrganizationLocationController extends SelectControllerInterface<
  OrganizationLocationModel[]
> {
  private static instance: IndexOrganizationLocationController
  private constructor() {
    super()
  }
  private IndexOrganizationLocationUseCase = new IndexOrganizationLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationLocationController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<OrganizationLocationModel[]> =
      await this.IndexOrganizationLocationUseCase.call(params)

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
