// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexOrganizatoinEmployeeUseCase from '../../Domain/useCase/indexOrganizatoinEmployeeUseCase'
import type OrganizatoinEmployeeModel from '../../Data/models/OrganizatoinEmployeeModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexOrganizatoinEmployeeController extends SelectControllerInterface<
  OrganizatoinEmployeeModel[]
> {
  private static instance: IndexOrganizatoinEmployeeController
  private constructor() {
    super()
  }
  private IndexOrganizatoinEmployeeUseCase = new IndexOrganizatoinEmployeeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOrganizatoinEmployeeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<OrganizatoinEmployeeModel[]> =
      await this.IndexOrganizatoinEmployeeUseCase.call(params)

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
