import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type FactoryItemModel from '../../Data/models/factoryItemModel'
import CloneFactoryItemsUseCase from '../../Domain/useCase/cloneFactoryItemsUseCase'

export default class CloneFactoryItemsController extends ControllerInterface<FactoryItemModel> {
  private static instance: CloneFactoryItemsController
  private readonly cloneFactoryItemsUseCase = new CloneFactoryItemsUseCase()

  private constructor() {
    super()
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new CloneFactoryItemsController()
    }
    return this.instance
  }

  async cloneFactoryItems(params: Params) {
    try {
      const dataState: DataState<FactoryItemModel> = await this.cloneFactoryItemsUseCase.call(params)
      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
