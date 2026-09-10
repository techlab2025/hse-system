// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'
import IndexWhereHouseTypeUseCase from '../../Domain/useCase/indexWhereHouseTypeUseCase'

export default class IndexSystemWhereHouseTypeController extends SelectControllerInterface<
  WhereHouseTypeModel[]
> {
  private static instance: IndexSystemWhereHouseTypeController
  private constructor() {
    super()
  }
  private IndexWhereHouseTypeUseCase = new IndexWhereHouseTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemWhereHouseTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<WhereHouseTypeModel[]> =
      await this.IndexWhereHouseTypeUseCase.call(params)

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
