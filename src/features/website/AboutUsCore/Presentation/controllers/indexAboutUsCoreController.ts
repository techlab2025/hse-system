// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import IndexAboutUsCoreUseCase from '../../Domain/useCase/indexAboutUsCoreUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexAboutUsCoreController extends SelectControllerInterface<
  AboutUsCoreModel[]
> {
  private static instance: IndexAboutUsCoreController
  private constructor() {
    super()
  }
  private IndexAboutUsCoreUseCase = new IndexAboutUsCoreUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAboutUsCoreController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<AboutUsCoreModel[]> =
      await this.IndexAboutUsCoreUseCase.call(params)

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
