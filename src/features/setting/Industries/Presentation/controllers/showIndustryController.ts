import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type IndustryModel from '../../Data/Models/IndustryModel'
import ShowIndustryUseCase from '../../Domain/useCase/showIndustryUseCase'

export default class ShowIndustryController extends ControllerInterface<IndustryModel> {
  private static instance: ShowIndustryController
  private constructor() {
    super()
  }
  private showIndustryUseCase = new ShowIndustryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowIndustryController()
    }
    return this.instance
  }

  async ShowIndustry(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<IndustryModel> = await this.showIndustryUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        // console.log(this.state.value.data)
        // console.log(draft)
        // useLoaderStore().endLoadingWithDialog();
      } else {
      }
    } catch (error: any) {}

    super.handleResponseDialogs()
    return this.state
  }
}
