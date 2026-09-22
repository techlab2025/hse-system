import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

import type DeleteTraningTopicParams from '../../Core/params/deleteTraningTopicParams'
import type TraningTopicModel from '../../Data/models/TraningTopicModel'
import DeleteTraningTopicUseCase from '../../Domain/useCase/deleteTraningTopicUseCase'

export default class DeleteTraningTopicController extends ControllerInterface<TraningTopicModel> {
  private static instance: DeleteTraningTopicController

  private constructor() {
    super()
  }

  private deleteTraningTopicUseCase = new DeleteTraningTopicUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new DeleteTraningTopicController()
    }
    return this.instance
  }

  async deleteTraningTopic(params: DeleteTraningTopicParams) {
    this.setLoading()
    const dataState: DataState<TraningTopicModel> =
      await this.deleteTraningTopicUseCase.call(params)
    this.setState(dataState)

    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: this.state.value.message ?? 'Success',
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

    super.handleResponseDialogs()
    return this.state
  }
}
