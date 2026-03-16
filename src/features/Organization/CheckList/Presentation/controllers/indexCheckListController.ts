// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type CheckListDetailsModel from '../../Data/models/CheckListModel'
import IndexCheckListUseCase from '../../Domain/useCase/indexCheckListUseCase'


export default class IndexCheckListController extends SelectControllerInterface<
  CheckListDetailsModel[]
> {
  private static instance: IndexCheckListController
  private constructor() {
    super()
  }
  private IndexCheckListUseCase = new IndexCheckListUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexCheckListController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<CheckListDetailsModel[]> =
      await this.IndexCheckListUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      // useLoaderStore().endLoadingWithDialog();
    } else {
      throw new Error('Error while addServices')
    }
    console.log('bbbbbbbbbbbbbbbbbbbbtate',this.state.value.data)
    super.handleResponseDialogs()
    return this.state
  }
}
