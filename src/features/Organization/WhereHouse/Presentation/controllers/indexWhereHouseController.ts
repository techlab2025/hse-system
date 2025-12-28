// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type WhereHouseModel from '../../Data/models/WhereHouseModel'
import IndexWhereHouseUseCase from '../../Domain/useCase/indexWhereHouseUseCase'


export default class IndexWhereHouseController extends SelectControllerInterface<
  WhereHouseModel[]
> {
  private static instance: IndexWhereHouseController
  private constructor() {
    super()
  }
  private IndexWhereHouseUseCase = new IndexWhereHouseUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexWhereHouseController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<WhereHouseModel[]> =
      await this.IndexWhereHouseUseCase.call(params)

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
