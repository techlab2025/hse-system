import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
// import EditInvestigationMeetingUseCase from '../../Domain/useCase/editInvestigationMeetingUseCase'
import type InvestigationMeetingModel from '../../Data/models/investigationMeetingModel'
import { Observation } from '../../Core/Enums/ObservationTypeEnum'
import EditInvestigationMeetingUseCase from '@/features/Organization/InvestigationMeeting/Domain/useCase/editInvestigationMeetingUseCase'

export default class EditInvestigationMeetingController extends ControllerInterface<InvestigationMeetingModel> {
  private static instance: EditInvestigationMeetingController

  private constructor() {
    super()
  }

  private EditInvestigationMeetingUseCase = new EditInvestigationMeetingUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditInvestigationMeetingController()
    }
    return this.instance
  }

  async editInvestigationMeeting(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<InvestigationMeetingModel> = await this.EditInvestigationMeetingUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
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
        }        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
