import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import ShowLangModel from '@/features/setting/languages/Data/models/langDetailsModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import ShowLangUseCase from '@/features/setting/languages/Domain/useCase/showLangUseCase'

export default class ShowLangController extends ControllerInterface<ShowLangModel> {
  private static instance: ShowLangController

  private constructor() {
    super()
  }

  private ShowLangUseCase = new ShowLangUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowLangController()
    }
    return this.instance
  }

  async showLang(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<ShowLangModel> = await this.ShowLangUseCase.call(params)

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
