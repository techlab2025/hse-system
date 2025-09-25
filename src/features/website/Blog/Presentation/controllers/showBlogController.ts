import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type BlogteDetailsModel from '../../Data/models/BlogDetailsModel'
import ShowBlogteUseCase from '../../Domain/useCase/showBlogUseCase'

export default class ShowBlogteController extends ControllerInterface<BlogteDetailsModel> {
  private static instance: ShowBlogteController

  private constructor() {
    super()
  }

  private ShowBlogteUseCase = new ShowBlogteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ShowBlogteController()
    }
    return this.instance
  }

  async showBlog(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()

    const dataState: DataState<BlogteDetailsModel> =
      await this.ShowBlogteUseCase.call(params)

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
