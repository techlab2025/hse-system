// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type ServiceSectionModel from '../../Data/models/ServiceSectionModel'
import IndexServiceSectionUseCase from '../../Domain/useCase/indexServiceSectionUseCase'

// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexServiceSectionController extends SelectControllerInterface<
  ServiceSectionModel[]
> {
  private static instance: IndexServiceSectionController
  private constructor() {
    super()
  }
  private indexServiceSectionUseCase = new IndexServiceSectionUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexServiceSectionController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<ServiceSectionModel[]> =
      await this.indexServiceSectionUseCase.call(params)

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
