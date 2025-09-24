// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type LocationModel from '../../Data/models/LocationModel'
import IndexLocationUseCase from '../../Domain/useCase/indexLocationUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexLocationController extends SelectControllerInterface<LocationModel[]> {
  private static instance: IndexLocationController
  private constructor() {
    super()
  }
  private indexLocationUseCase = new IndexLocationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexLocationController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<LocationModel[]> = await this.indexLocationUseCase.call(params)

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
