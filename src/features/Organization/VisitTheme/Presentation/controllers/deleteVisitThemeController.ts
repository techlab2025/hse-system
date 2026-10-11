import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import errorImage from '@/assets/images/error.png'
import type VisitThemeModel from '../../Data/models/VisitThemeModel'
import DeleteVisitThemeUseCase from '../../Domain/useCase/deleteVisitThemeUseCase'

export default class DeleteVisitThemeController extends ControllerInterface<VisitThemeModel> {
  private static instance: DeleteVisitThemeController
  private readonly useCase = new DeleteVisitThemeUseCase()
  private constructor() {
    super()
  }
  static getInstance() {
    if (!this.instance) this.instance = new DeleteVisitThemeController()
    return this.instance
  }
  async deleteVisitTheme(params: Params) {
    try {
      const dataState: DataState<VisitThemeModel> = await this.useCase.call(params)
      this.setLoading()
      this.setState(dataState)
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }
    super.handleResponseDialogs()
    return this.state
  }
}
