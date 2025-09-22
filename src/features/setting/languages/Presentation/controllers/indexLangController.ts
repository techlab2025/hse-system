// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import IndexLangUseCase from '@/features/setting/languages/Domain/useCase/indexLangUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexLangController extends SelectControllerInterface<LangModel[]> {
  private static instance: IndexLangController
  private constructor() {
    super()
  }
  private IndexLangUseCase = new IndexLangUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexLangController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<LangModel[]> = await this.IndexLangUseCase.call(params)

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
