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
import AddInvestigationMeetingUseCase from '../../Domain/useCase/addInvestigationMeetingUseCase'
import type InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'
import { Observation } from '../../Core/Enums/ObservationTypeEnum'

export default class AddInvestigationMeetingController extends ControllerInterface<InvestigationMeetingModel> {
  private static instance: AddInvestigationMeetingController
  private constructor() {
    super()
  }
  private AddInvestigationMeetingUseCase = new AddInvestigationMeetingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInvestigationMeetingController()
    }
    return this.instance
  }

  async addInvestigationMeeting(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // console.log('Ssssssss')
      const dataState: DataState<InvestigationMeetingModel> = await this.AddInvestigationMeetingUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        if (params.type == Observation.InvestigationMeetingType) {
          await router.push(`/organization/investigating`)
        }
        else if (params.type == Observation.ObservationType) {
          await router.push(`/organization/observation`)
        }
        else if (params.type == Observation.AccidentsType) {
          await router.push(`/organization/incedant`)
        }

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
