import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type AboutUsFeatureModel from '../../Data/models/AboutUsFeatureModel'
import EditAboutUsFeatureUseCase from '../../Domain/useCase/editAboutUsFeatureUseCase'




export default class EditAboutUsFeatureController extends ControllerInterface<AboutUsFeatureModel> {
  private static instance: EditAboutUsFeatureController

  private constructor() {
    super()
  }

  private EditAboutUsFeatureUseCase = new EditAboutUsFeatureUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditAboutUsFeatureController()
    }
    return this.instance
  }

  async editAboutUsFeature(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<AboutUsFeatureModel> = await this.EditAboutUsFeatureUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/about-us-features')
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
