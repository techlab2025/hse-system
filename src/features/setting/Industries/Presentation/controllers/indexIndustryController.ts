import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type IndustryModel from '../../Data/Models/IndustryModel'
import IndexIndustryUseCase from '../../Domain/useCase/indexIndustryUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface.ts'

export default class IndexIndustryController extends SelectControllerInterface<IndustryModel[]> {
  private static instance: IndexIndustryController
  private constructor() {
    super()
  }
  private indexIndustryUseCase = new IndexIndustryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexIndustryController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<IndustryModel[]> = await this.indexIndustryUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        // console.log(this.state.value.data)
        // console.log(draft)
        // if (!draft) await router.push('/')
        // useLoaderStore().endLoadingWithDialog();
      } else {
      }
    } catch (error: any) {
      console.log(error)

    }

    super.handleResponseDialogs()
    return this.state
  }
}
