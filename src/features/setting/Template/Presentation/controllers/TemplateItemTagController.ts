import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type TemplateItemTagModel from '../../Data/models/TemplateItemTagModel'
import TemplateItemTagUseCase from '../../Domain/useCase/TemplateItemTagUseCase'

export default class TemplateItemTagController extends ControllerInterface<TemplateItemTagModel[]> {
  private static instance: TemplateItemTagController

  private constructor() {
    super()
  }

  private templateItemTagUseCase = new TemplateItemTagUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new TemplateItemTagController()
    }
    return this.instance
  }

  async TemplateItemTag(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<TemplateItemTagModel[]> =
      await this.templateItemTagUseCase.call(params)

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
