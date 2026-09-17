import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import type IndustryModel from '../../Data/Models/IndustryModel'
import IndexIndustryUseCase from '../../Domain/useCase/indexIndustryUseCase'
import { SelectControllerInterface } from '@/base/Presentation/Controller/select_controller_interface.ts'

export default class IndexIndustryController extends SelectControllerInterface<IndustryModel[]> {
  private static instance: IndexIndustryController
  private constructor() {
    super()
  }
  private indexIndustryUseCase = new IndexIndustryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new IndexIndustryController()
    }
    return this.instance
  }

  async getData(params: Params) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<IndustryModel[]> = await this.indexIndustryUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        // console.log(this.state.value.data)
        // console.log(draft)
        // if (!draft) await router.push('/')
        // useLoaderStore().endLoadingWithDialog();
      } else {

        // DialogSelector.instance.failedDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
        //   imageElement: errorImage,
        //   messageContent: null,
        // })
      }
    } catch (error: any) {
      // DialogSelector.instance.failedDialog.openDialog({
      //   dialogName: 'dialog',
      //   titleContent: this.state.value.error?.title,
      //   imageElement: errorImage,
      //   messageContent: null,
      // })

    }

    super.handleResponseDialogs()
    return this.state
  }
}
