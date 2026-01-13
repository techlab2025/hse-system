// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type InjuryModel from '../../Data/models/InjuryModel'
import IndexInjuryUseCase from '../../Domain/useCase/indexEmployeeCertificateUseCase'


export default class IndexInjuryController extends SelectControllerInterface<
  InjuryModel[]
> {
  private static instance: IndexInjuryController
  private constructor() {
    super()
  }
  private IndexInjuryUseCase = new IndexInjuryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexInjuryController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<InjuryModel[]> =
      await this.IndexInjuryUseCase.call(params)

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
