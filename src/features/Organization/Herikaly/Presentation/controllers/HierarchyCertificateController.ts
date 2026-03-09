import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import FetchHierarchyCertificateUseCase from '../../Domain/useCase/FetchHierarachyCertificatesUseCase'
import type HierarchyCertificateModel from '../../Data/models/HeirarchyCertificateModel'

export default class HierarchyCertyificateController extends ControllerInterface<
  HierarchyCertificateModel[]
> {
  private static instance: HierarchyCertyificateController
  private constructor() {
    super()
  }
  private fetchHierarchyCertificateUseCase = new FetchHierarchyCertificateUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new HierarchyCertyificateController()
    }
    return this.instance
  }

  async FetchHerikalyCertificate(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log("Ssssssss")
      const dataState: DataState<HierarchyCertificateModel[]> =
        await this.fetchHierarchyCertificateUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        // DialogSelector.instance.successDialog.openDialog({
        //   dialogName: 'dialog-success',
        //   titleContent: 'Added was successful',
        //   imageElement: successImage,
        //   messageContent: null,
        // })
        // if (router?.currentRoute?.value?.fullPath.includes('herikaly')) {
        //   if (!draft) await router.push('/organization/herikaly')
        // }
        // useLoaderStore().endLoadingWithDialog();
      } else {
        // DialogSelector.instance.failedDialog.openDialog({
        //   dialogName: 'dialog',
        //   titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
        //   imageElement: errorImage,
        //   messageContent: null,
        // })
      }
    } catch (error: unknown) {
      // DialogSelector.instance.failedDialog.openDialog({
      //   dialogName: 'dialog-error',
      //   titleContent: this.state.value.error?.title ?? (error as string),
      //   imageElement: errorImage,
      //   messageContent: null,
      // })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
