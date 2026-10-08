import { featureTranslation } from '../../../featureTranslation'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

import type { Router } from 'vue-router'
import AddTraningTopicParams from '../../Core/params/addTraningTopicParams'
import AddTraningTopicExcelParams from '../../Core/params/addTraningTopicExcelParams'
import type TraningTopicModel from '../../Data/models/TraningTopicModel'
import AddTraningTopicUseCase from '../../Domain/useCase/addTraningTopicUseCase'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'

export default class AddTraningTopicController extends ControllerInterface<TraningTopicModel> {
  private static instance: AddTraningTopicController

  private constructor() {
    super()
  }

  private addTraningTopicUseCase = new AddTraningTopicUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTraningTopicController()
    }
    return this.instance
  }

  async addTraningTopic(
    params: AddTraningTopicParams | AddTraningTopicExcelParams,
    router?: Router,
    draft: boolean = false,
  ) {
    if (params instanceof AddTraningTopicParams) {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
    }

    if (params instanceof AddTraningTopicExcelParams) {
      if (!params.data.length) {
        new OpenWarningDilaog(featureTranslation('excel_row_required')).openDialog()
        return
      }

      if (params.data.some((row) => !row.title?.trim())) {
        new OpenWarningDilaog(featureTranslation('excel_row_title_required')).openDialog()
        return
      }
    }

    this.setLoading()
    const dataState: DataState<TraningTopicModel> =
      await this.addTraningTopicUseCase.call(params)
    this.setState(dataState)

    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: this.state.value.message ?? featureTranslation('success'),
        imageElement: successImage,
        messageContent: null,
      })

      if (router && !draft) {
        const root = router.currentRoute.value.path.startsWith('/admin')
          ? '/admin'
          : '/organization'
        await router.push(`${root}/traning-topics`)
      }
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
