// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type TemplateModel from '../../Data/models/TemplateModel'
import IndexTemplateUseCase from '../../Domain/useCase/indexTemplateUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexTemplateController extends SelectControllerInterface<
  TemplateModel[]
> {
  private static instance: IndexTemplateController
  private constructor() {
    super()
  }
  private IndexTemplateUseCase = new IndexTemplateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexTemplateController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<TemplateModel[]> =
      await this.IndexTemplateUseCase.call(params)

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
