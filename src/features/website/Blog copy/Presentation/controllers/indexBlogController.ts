// import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface'
import type BlogModel from '../../Data/models/BlogModel'
import IndexBlogUseCase from '../../Domain/useCase/indexBlogUseCase'
// import TitleInterface from '@/base/Data/Models/title_interface'

export default class IndexBlogController extends SelectControllerInterface<
  BlogModel[]
> {
  private static instance: IndexBlogController
  private constructor() {
    super()
  }
  private IndexBlogUseCase = new IndexBlogUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexBlogController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    this.setLoading()
    const dataState: DataState<BlogModel[]> =
      await this.IndexBlogUseCase.call(params)

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
