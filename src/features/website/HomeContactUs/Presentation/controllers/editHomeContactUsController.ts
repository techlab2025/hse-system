import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type HomeContactUsModel from '../../Data/models/HomeContactUsModel'
import EditHomeContactUsUseCase from '../../Domain/useCase/editHomeContactUsUseCase'


export default class EditHomeContactUsController extends ControllerInterface<HomeContactUsModel> {
  private static instance: EditHomeContactUsController

  private constructor() {
    super()
  }

  private EditHomeContactUsUseCase = new EditHomeContactUsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHomeContactUsController()
    }
    return this.instance
  }

  async editHomeContactUs(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HomeContactUsModel> = await this.EditHomeContactUsUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/home-contact-us')
        // console.log(this.state.value.data)
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
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
