import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

import type { Router } from 'vue-router'
import type EditTraningTopicParams from '../../Core/params/editTraningTopicParams'
import type TraningTopicModel from '../../Data/models/TraningTopicModel'
import EditTraningTopicUseCase from '../../Domain/useCase/editTraningTopicUseCase'

export default class EditTraningTopicController extends ControllerInterface<TraningTopicModel> {
  private static instance: EditTraningTopicController

  private constructor() {
    super()
  }

  private editTraningTopicUseCase = new EditTraningTopicUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTraningTopicController()
    }
    return this.instance
  }

  async editTraningTopic(params: EditTraningTopicParams, router: Router) {
    params.validate()
    if (!params.validate().isValid) {
      params.validateOrThrow()
      return
    }

    this.setLoading()
    const dataState: DataState<TraningTopicModel> =
      await this.editTraningTopicUseCase.call(params)
    this.setState(dataState)

    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: this.state.value.message ?? featureTranslation('success'),
        imageElement: successImage,
        messageContent: null,
      })

      const root = router.currentRoute.value.path.startsWith('/admin')
        ? '/admin'
        : '/organization'
      await router.push(`${root}/traning-topics`)
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
