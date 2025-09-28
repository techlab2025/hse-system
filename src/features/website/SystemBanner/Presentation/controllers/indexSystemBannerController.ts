// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type SystemBannerModel from '../../Data/models/SystemBannerModel'
import IndexSystemBannerUseCase from '../../Domain/useCase/indexSystemBannerUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexSystemBannerController extends SelectControllerInterface<
  SystemBannerModel[]
> {
  private static instance: IndexSystemBannerController
  private constructor() {
    super()
  }
  private indexSystemBannerUseCase = new IndexSystemBannerUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemBannerController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<SystemBannerModel[]> =
      await this.indexSystemBannerUseCase.call(params)

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
