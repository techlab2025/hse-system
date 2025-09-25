import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type HomeAboutUsModel from '../../Data/models/HomeAboutUsModel'
import EditHomeAboutUsUseCase from '../../Domain/useCase/editHomeAboutUsUseCase'


export default class EditHomeAboutUsController extends ControllerInterface<HomeAboutUsModel> {
  private static instance: EditHomeAboutUsController

  private constructor() {
    super()
  }

  private EditHomeAboutUsUseCase = new EditHomeAboutUsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditHomeAboutUsController()
    }
    return this.instance
  }

  async editHomeAboutUs(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<HomeAboutUsModel> = await this.EditHomeAboutUsUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/home-about-us')
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
