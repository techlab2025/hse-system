// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import IndexAboutUsFeatureUseCase from '../../Domain/useCase/indexAboutUsFeatureUseCase'


// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexAboutUsFeatureController extends SelectControllerInterface<
  AboutUsFeatureModel[]
> {
  private static instance: IndexAboutUsFeatureController
  private constructor() {
    super()
  }
  private IndexAboutUsFeatureUseCase = new IndexAboutUsFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexAboutUsFeatureController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<AboutUsFeatureModel[]> =
      await this.IndexAboutUsFeatureUseCase.call(params)

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
