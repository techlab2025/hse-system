// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type OrganizationModel from '../../Data/models/OrganizationModel'
import IndexOrganizationUseCase from '../../Domain/useCase/indexOrganizationUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexOrganizationController extends SelectControllerInterface<
  OrganizationModel[]
> {
  private static instance: IndexOrganizationController
  private constructor() {
    super()
  }
  private indexOrganizationUseCase = new IndexOrganizationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizationController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<OrganizationModel[]> =
      await this.indexOrganizationUseCase.call(params)

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
