import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type CheckListDetailsModel from '../../Data/models/CheckListModel'
import ShowCheckListUseCase from '../../Domain/useCase/showCheckListUseCase'

export default class ShowCheckListController extends ControllerInterface<CheckListDetailsModel> {
  private static instance: ShowCheckListController

  private constructor() {
    super()
  }

  private ShowCheckListUseCase = new ShowCheckListUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowCheckListController()
    }
    return this.instance
  }

  async showCheckList(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<CheckListDetailsModel> =
      await this.ShowCheckListUseCase.call(params)

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
