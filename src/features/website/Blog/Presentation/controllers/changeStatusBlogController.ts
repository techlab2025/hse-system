import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type BlogModel from '../../Data/models/BlogModel'
import ChangeStatusBlogUseCase from '../../Domain/useCase/changeStatusBlogUseCase'





export default class ChangeStatusBlogController extends ControllerInterface<BlogModel> {
  private static instance: ChangeStatusBlogController
  private constructor() {
    super()
  }
  private ChangeStatusBlogUseCase = new ChangeStatusBlogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ChangeStatusBlogController()
    }
    return this.instance
  }

  async changeStatusBlog(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<BlogModel> =
      await this.ChangeStatusBlogUseCase.call(params)

    this.setState(dataState)
    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: successImage,
        messageContent: null,
      })
      // useLoaderStore().endLoadingWithDialog();
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title! ?? 'Ann Error Occurred',
        imageElement: errorImage,
        messageContent: null,
      })
      throw new Error('Error while addServices')
    }
    super.handleResponseDialogs()
    return this.state
  }
}
