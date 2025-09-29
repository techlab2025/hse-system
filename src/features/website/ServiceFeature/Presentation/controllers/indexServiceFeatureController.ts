// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexServiceFeatureUseCase from '../../Domain/useCase/indexServiceFeatureUseCase'
import type ServiceFeatureModel from '../../Data/models/ServiceFeatureModel'


// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexServiceFeatureController extends SelectControllerInterface<
  ServiceFeatureModel[]
> {
  private static instance: IndexServiceFeatureController
  private constructor() {
    super()
  }
  private IndexServiceFeatureUseCase = new IndexServiceFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexServiceFeatureController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ServiceFeatureModel[]> =
      await this.IndexServiceFeatureUseCase.call(params)

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
