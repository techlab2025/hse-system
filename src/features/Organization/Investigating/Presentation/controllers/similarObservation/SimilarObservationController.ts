import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import SimilarObservationUseCase from '../../../Domain/useCase/SimilarObservation/SimilarObservationUseCase'
import type HazardDetailsModel from '@/features/Organization/ObservationFactory/Data/models/hazardDetailsModel'

export default class SimilarObservationController extends ControllerInterface<
  HazardDetailsModel[]
> {
  private static instance: SimilarObservationController
  private constructor() {
    super()
  }
  private similarObservationUseCase = new SimilarObservationUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new SimilarObservationController()
    }
    return this.instance
  }

  async fetchSimilarObservations(params: Params, router: Router, draft: boolean = false) {
    try {
      const dataState: DataState<HazardDetailsModel[]> =
        await this.similarObservationUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess() && !draft) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
      } else if (!draft) {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      if (!draft) {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? (error as string),
          imageElement: errorImage,
          messageContent: null,
        })
      }
    }

    super.handleResponseDialogs()
    return this.state
  }
}
