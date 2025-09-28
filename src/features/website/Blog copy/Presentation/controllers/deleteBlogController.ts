import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type BlogModel from '../../Data/models/BlogModel'
import DeleteBlogUseCase from '../../Domain/useCase/deleteBlogUseCase'

export default class DeleteBlogController extends ControllerInterface<BlogModel> {
  private static instance: DeleteBlogController
  private constructor() {
    super()
  }
  private DeleteBlogUseCase = new DeleteBlogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteBlogController()
    }
    return this.instance
  }

  async deleteBlog(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<BlogModel> =
        await this.DeleteBlogUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        // useLoaderStore().endLoadingWithDialog();
      } else {
        throw new Error('Error while addServices')
      }
    } catch (error: any) {
      console.log(error)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
