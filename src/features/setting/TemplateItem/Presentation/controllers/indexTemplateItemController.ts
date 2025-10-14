// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type TemplateItemModel from '../../Data/models/TemplateItemModel'
import IndexTemplateItemUseCase from '../../Domain/useCase/indexTemplateItemUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexTemplateItemController extends SelectControllerInterface<TemplateItemModel[]> {
  private static instance: IndexTemplateItemController
  private constructor() {
    super()
  }
  private indexTemplateItemUseCase = new IndexTemplateItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTemplateItemController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<TemplateItemModel[]> = await this.indexTemplateItemUseCase.call(params)

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
