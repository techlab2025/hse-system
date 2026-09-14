// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import IndexMeetingTypeUseCase from '../../Domain/useCase/indexMeetingTypeUseCase'

export default class IndexSystemMeetingTypeController extends SelectControllerInterface<
  MeetingTypeModel[]
> {
  private static instance: IndexSystemMeetingTypeController
  private constructor() {
    super()
  }
  private indexMeetingTypeUseCase = new IndexMeetingTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexSystemMeetingTypeController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<MeetingTypeModel[]> = await this.indexMeetingTypeUseCase.call(params)

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
