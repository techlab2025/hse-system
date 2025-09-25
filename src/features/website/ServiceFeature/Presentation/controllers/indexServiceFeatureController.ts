// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ServiceModel from '../../Data/models/ServiceFeatureModel'
import IndexServiceUseCase from '../../Domain/useCase/indexServiceFeatureUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexServiceController extends SelectControllerInterface<ServiceModel[]> {
  private static instance: IndexServiceController
  private constructor() {
    super()
  }
  private IndexServiceUseCase = new IndexServiceUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexServiceController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ServiceModel[]> = await this.IndexServiceUseCase.call(params)

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
