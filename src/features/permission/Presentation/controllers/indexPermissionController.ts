// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexPermissionUseCase from '../../Domain/useCase/indexPermissionUseCase'
import type PermissionModel from '../../Data/models/PermissionModel'



export default class IndexPermissionController extends SelectControllerInterface<
  PermissionModel[]
> {
  private static instance: IndexPermissionController
  private constructor() {
    super()
  }
  private IndexPermissionUseCase = new IndexPermissionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPermissionController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<PermissionModel[]> =
      await this.IndexPermissionUseCase.call(params)

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
