// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexInvestigatingUseCase from '../../Domain/useCase/indexInvestigatingUseCase'
import type InvestigatingModel from '../../Data/models/investigatingModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexInvestigatingController extends SelectControllerInterface<
  InvestigatingModel[]
> {
  private static instance: IndexInvestigatingController
  private constructor() {
    super()
  }
  private IndexInvestigatingUseCase = new IndexInvestigatingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInvestigatingController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<InvestigatingModel[]> =
      await this.IndexInvestigatingUseCase.call(params)

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
