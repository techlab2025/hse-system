import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import AddHazardUseCase from '../../Domain/useCase/addHazardUseCase'
import type HazardModel from '../../Data/models/hazardModel'
import { Observation } from '../../Core/Enums/ObservationTypeEnum'
import type AddHazardParams from '../../Core/params/addHazardParams'
import ToggleObservationWorkStoppedUseCase from '../../Domain/useCase/ToggleObservationWorkStoppedUseCase'
import type ToggleObservationWorkStoppedParams from '../../Core/params/ToggleObservationWorkStoppedParams'

export default class ToggleObservationWorkStoppedController extends ControllerInterface<HazardModel> {
  private static instance: ToggleObservationWorkStoppedController
  private constructor() {
    super()
  }
  private ToggleObservationWorkStoppedUseCase = new ToggleObservationWorkStoppedUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ToggleObservationWorkStoppedController()
    }
    return this.instance
  }

  async toggleObservationWorkStopped(
    params: ToggleObservationWorkStoppedParams,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log('Ssssssss')
      const dataState: DataState<HazardModel> =
        await this.ToggleObservationWorkStoppedUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
