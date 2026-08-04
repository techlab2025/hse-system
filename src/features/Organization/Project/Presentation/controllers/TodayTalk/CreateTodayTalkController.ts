import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type TodayTalkModel from '../../../Data/models/TodayTalk/TodayTalkModel'
import CreateTodayTalkUseCase from '../../../Domain/useCase/TodayTalk/CreateTodayTalkUseCase'

export default class CreateTodayTalkController extends ControllerInterface<TodayTalkModel> {
  private static instance: CreateTodayTalkController
  private readonly useCase = new CreateTodayTalkUseCase()

  private constructor() {
    super()
  }

  static getInstance(): CreateTodayTalkController {
    if (!this.instance) this.instance = new CreateTodayTalkController()
    return this.instance
  }

  async createTodayTalk(params: Params, projectId: number, router: Router) {
    this.setLoading()
    const dataState: DataState<TodayTalkModel> = await this.useCase.call(params)
    this.setState(dataState)

    if (this.isDataSuccess()) {
      DialogSelector.instance.successDialog.openDialog({
        dialogName: 'dialog-success',
        titleContent: "Today's talk was saved successfully",
        imageElement: successImage,
        messageContent: null,
      })
      await router.push(`/organization/project-details/${projectId}`)
    } else {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? "Today's talk could not be saved",
        imageElement: errorImage,
        messageContent: null,
      })
    }

    return this.state
  }
}
