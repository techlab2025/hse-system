import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

import type AddTraningTopicClonesParams from '../../Core/params/AddTraningTopicClonesParams'
import type TraningTopicModel from '../../Data/models/TraningTopicModel'
import AddTraningTopicCloneUseCase from '../../Domain/useCase/addTraningTopicCloneUseCase'
import IndexTraningTopicController from './indexTraningTopicController'
import IndexTraningTopicParams from '../../Core/params/indexTraningTopicParams'

export default class AddTraningTopicCloneController extends ControllerInterface<TraningTopicModel> {
  private static instance: AddTraningTopicCloneController

  private constructor() {
    super()
  }

  private addTraningTopicCloneUseCase = new AddTraningTopicCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTraningTopicCloneController()
    }
    return this.instance
  }

  async addTraningTopicClone(params: AddTraningTopicClonesParams) {
    params.validate()
    if (!params.validate().isValid) {
      params.validateOrThrow()
      return
    }

    this.setLoading()
    const dataState: DataState<TraningTopicModel> =
      await this.addTraningTopicCloneUseCase.call(params)
    this.setState(dataState)

    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: this.state.value.message ?? featureTranslation('success'),
        imageElement: successImage,
        messageContent: null,
      })

      await IndexTraningTopicController.getInstance().getData(
        new IndexTraningTopicParams('', 1, 10, 1, true),
      )
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? featureTranslation('error_occurred'),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
