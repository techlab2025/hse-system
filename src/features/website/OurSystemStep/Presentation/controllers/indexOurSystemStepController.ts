// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type OurSystemStepModel from '../../Data/models/OurSystemStepModel'
import IndexOurSystemStepUseCase from '../../Domain/useCase/indexOurSystemStepUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexOurSystemStepController extends SelectControllerInterface<
  OurSystemStepModel[]
> {
  private static instance: IndexOurSystemStepController
  private constructor() {
    super()
  }
  private IndexOurSystemStepUseCase = new IndexOurSystemStepUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexOurSystemStepController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<OurSystemStepModel[]> =
      await this.IndexOurSystemStepUseCase.call(params)

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
