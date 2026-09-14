// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type MangementChangeTopicTypeDetailsModel from '../../Data/models/MangementChangeTopicTypeDetailsModel'
import IndexMangementChangeTopicTypeUseCase from '../../Domain/useCase/indexMangementChangeTopicTypeUseCase'

export default class IndexSystemMamgementChangeTopicController extends SelectControllerInterface<
  MangementChangeTopicTypeDetailsModel[]
> {
  private static instance: IndexSystemMamgementChangeTopicController
  private constructor() {
    super()
  }
  private IndexMangementChangeTopicTypeUseCase = new IndexMangementChangeTopicTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemMamgementChangeTopicController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<MangementChangeTopicTypeDetailsModel[]> =
      await this.IndexMangementChangeTopicTypeUseCase.call(params)

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
