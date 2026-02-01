import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type TicketModel from '../../Data/models/TicketModel'
import EditTicketUseCase from '../../Domain/useCase/editTicketUseCase'
import type EditTicketParams from '../../Core/params/editTicketParams'

export default class EditTicketController extends ControllerInterface<TicketModel> {
  private static instance: EditTicketController

  private constructor() {
    super()
  }

  private EditTicketUseCase = new EditTicketUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTicketController()
    }
    return this.instance
  }

  async editTicket(params: EditTicketParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<TicketModel> = await this.EditTicketUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })
        const { user } = useUserStore()

        await router.push(
          `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/tickets`,
        )
        // console.log(this.state.value.data)
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
