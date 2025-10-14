import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowTemplateItemUseCase from '../../Domain/useCase/showTemplateItemUseCase'
import type TemplateItemDetailsModel from '../../Data/models/TemplateItemDetailsModel'

export default class ShowTemplateItemController extends ControllerInterface<TemplateItemDetailsModel> {
  private static instance: ShowTemplateItemController

  private constructor() {
    super()
  }

  private showTemplateItemUseCase = new ShowTemplateItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTemplateItemController()
    }
    return this.instance
  }

  async showTemplateItemType(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<TemplateItemDetailsModel> = await this.showTemplateItemUseCase.call(params)

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
