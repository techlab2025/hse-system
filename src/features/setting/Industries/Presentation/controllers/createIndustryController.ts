import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from "@/assets/images/Success.png";
import errorImage from "@/assets/images/error.png";
import CraeteIndustryUseCase from '../../Domain/useCase/createIndustryUseCase'
import type IndustryModel from '../../Data/Models/IndustryModel'

export default class CreateIndustryController extends ControllerInterface<IndustryModel> {
  private static instance: CreateIndustryController
  private constructor() {
    super()
  }
  private craeteIndustryUseCase = new CraeteIndustryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateIndustryController()
    }
    return this.instance
  }

  async CreateIndustry(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<IndustryModel> = await this.craeteIndustryUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        // console.log(this.state.value.data)
        // console.log(draft)
        if (!draft) await router.push('/admin/industry')

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title,
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
