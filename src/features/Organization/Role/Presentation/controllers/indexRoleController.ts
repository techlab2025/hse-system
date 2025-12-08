// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type RoleModel from '../../Data/models/RoleModel'
import IndexRoleUseCase from '../../Domain/useCase/indexRoleUseCase'


export default class IndexRoleController extends SelectControllerInterface<
  RoleModel[]
> {
  private static instance: IndexRoleController
  private constructor() {
    super()
  }
  private IndexRoleUseCase = new IndexRoleUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexRoleController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<RoleModel[]> =
      await this.IndexRoleUseCase.call(params)

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
