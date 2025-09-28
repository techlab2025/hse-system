import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type AboutUsCoreModel from '../../Data/models/AboutUsCoreModel'
import EditAboutUsCoreUseCase from '../../Domain/useCase/editAboutUsCoreUseCase'


export default class EditAboutUsCoreController extends ControllerInterface<AboutUsCoreModel> {
  private static instance: EditAboutUsCoreController

  private constructor() {
    super()
  }

  private EditAboutUsCoreUseCase = new EditAboutUsCoreUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAboutUsCoreController()
    }
    return this.instance
  }

  async editAboutUsCore(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AboutUsCoreModel> = await this.EditAboutUsCoreUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/about-us-core')
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
