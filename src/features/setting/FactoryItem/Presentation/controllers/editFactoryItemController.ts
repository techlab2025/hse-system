import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type FactoryItemModel from '@/features/setting/FactoryItem/Data/models/factoryItemModel.ts'
import EditFactoryItemUseCase from '@/features/setting/FactoryItem/Domain/useCase/editFactoryItemUseCase.ts'

export default class EditFactoryItemController extends ControllerInterface<FactoryItemModel> {
  private static instance: EditFactoryItemController

  private constructor() {
    super()
  }

  private EditFactoryUseCase = new EditFactoryItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditFactoryItemController()
    }
    return this.instance
  }

  async editFactory(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<FactoryItemModel> = await this.EditFactoryUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        await router.push('/admin/factories-items')
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
