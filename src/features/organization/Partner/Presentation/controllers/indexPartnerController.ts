// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type PartnerModel from '../../Data/models/PartnerModel'
import IndexPartnerUseCase from '../../Domain/useCase/indexPartnerUseCase'


export default class IndexPartnerController extends SelectControllerInterface<
  PartnerModel[]
> {
  private static instance: IndexPartnerController
  private constructor() {
    super()
  }
  private IndexPartnerUseCase = new IndexPartnerUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexPartnerController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<PartnerModel[]> =
      await this.IndexPartnerUseCase.call(params)

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
