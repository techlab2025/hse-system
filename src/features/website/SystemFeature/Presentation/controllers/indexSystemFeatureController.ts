// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexSystemFeatureUseCase from '../../Domain/useCase/indexSystemFeatureUseCase'
import type SystemFeatureModel from '../../Data/models/SystemFeatureModel'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSystemFeatureController extends SelectControllerInterface<
  SystemFeatureModel[]
> {
  private static instance: IndexSystemFeatureController
  private constructor() {
    super()
  }
  private indexSystemFeatureUseCase = new IndexSystemFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemFeatureController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SystemFeatureModel[]> =
      await this.indexSystemFeatureUseCase.call(params)

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
