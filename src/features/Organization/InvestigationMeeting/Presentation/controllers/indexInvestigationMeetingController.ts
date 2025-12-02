// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import IndexInvestigationMeetingUseCase from '../../Domain/useCase/indexInvestigationMeetingUseCase'
import type InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexInvestigationMeetingController extends SelectControllerInterface<
  InvestigationMeetingModel[]
> {
  private static instance: IndexInvestigationMeetingController
  private constructor() {
    super()
  }
  private IndexInvestigationMeetingUseCase = new IndexInvestigationMeetingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInvestigationMeetingController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<InvestigationMeetingModel[]> =
      await this.IndexInvestigationMeetingUseCase.call(params)

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
