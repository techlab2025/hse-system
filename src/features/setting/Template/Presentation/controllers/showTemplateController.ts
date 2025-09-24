import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type TemplateDetailsModel from '../../Data/models/TemplateDetailsModel'
import ShowTemplateUseCase from '../../Domain/useCase/showTemplateUseCase'

export default class ShowTemplateController extends ControllerInterface<TemplateDetailsModel> {
  private static instance: ShowTemplateController

  private constructor() {
    super()
  }

  private ShowTemplateUseCase = new ShowTemplateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowTemplateController()
    }
    return this.instance
  }

  async showTemplate(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<TemplateDetailsModel> = await this.ShowTemplateUseCase.call(params)

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
