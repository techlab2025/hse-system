import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type FaqModel from '../../Data/models/FaqModel'
import AddFaqUseCase from '../../Domain/useCase/addFaqUseCase'

export default class AddFaqController extends ControllerInterface<FaqModel> {
  private static instance: AddFaqController
  private constructor() {
    super()
  }
  private AddFaqUseCase = new AddFaqUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddFaqController()
    }
    return this.instance
  }

  async addFaq(params: Params, router: Router, draft: boolean = false) {
    try {
      // ✅ validation: check if question and answer is not empty
      const hasQuestion =
        params.translation?.translations?.question &&
        Object.values(params.translation?.translations?.question).some(
          (val) => val && val.trim() !== ""
        )

      const hasAnswer =
        params.translation?.translations?.answer &&
        Object.values(params.translation?.translations?.answer).some(
          (val) => val && val.trim() !== ""
        )

      if (!hasQuestion || !hasAnswer) {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Please fill both Question and Answer",
          imageElement: errorImage,
          messageContent: null,
        })
        return this.state
      }

      // ✅ if question and answer is not empty
      const dataState: DataState<FaqModel> =
        await this.AddFaqUseCase.call(params)
      // console.log(params, "pppp")

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: "dialog",
          titleContent: "Added was successful",
          imageElement: successImage,
          messageContent: null,
        })
        if (!draft) await router.push("/admin/faq")
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: "dialog",
          titleContent: this.state.value.error?.title ?? "An Error Occurred",
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: "dialog",
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }


}
