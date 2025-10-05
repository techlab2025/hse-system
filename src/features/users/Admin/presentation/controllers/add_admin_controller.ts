import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type AdminModel from '../../Data/models/index_admin_model'
import AddAdminUseCase from '../../Domain/useCase/add_admin_use_case'

export default class AddAdminController extends ControllerInterface<AdminModel> {
  private static instance: AddAdminController
  private constructor() {
    super()
  }
  private AddAdminUseCase = new AddAdminUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddAdminController()
    }
    return this.instance
  }

  async addAdmin(params: Params, router: any, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<AdminModel> = await this.AddAdminUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        // console.log(this.state.value.data)
        // console.log(draft)
        if (!draft) await router.push('/admin/admins')

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
        // throw new Error(this.state.value.error?.title)
      }
    } catch (error: any) {
      console.log(this.state.value.message)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        // titleContent: 'adssddsasdadsa',
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
