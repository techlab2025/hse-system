// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexRootCausesUseCase from '@/features/setting/RootCauses/Domain/useCase/indexRootCausesUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type RootCausesModel from '../../Data/models/RootCausesModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexRootCausesController extends SelectControllerInterface<
  RootCausesModel[]
> {
  private static instance: IndexRootCausesController
  private constructor() {
    super()
  }
  private IndexRootCausesUseCase = new IndexRootCausesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexRootCausesController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<RootCausesModel[]> = await this.IndexRootCausesUseCase.call(params)

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
