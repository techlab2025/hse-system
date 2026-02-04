import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'

import router from '@/router'
import CloseTicketUseCase from '../../Domain/useCase/closeTicketUseCase'
import type CloseTicketParams from '../../Core/params/closeTicketParams'
import type TicketModel from '../../Data/models/TicketModel'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
const { user } = useUserStore()
export default class CloseTicketController extends ControllerInterface<TicketModel> {
  private static instance: CloseTicketController
  private constructor() {
    super()
  }
  private CloseTicketUseCase = new CloseTicketUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CloseTicketController()
    }
    return this.instance
  }

  async closeTicket(params: CloseTicketParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }

      const dataState: DataState<TicketModel> = await this.CloseTicketUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'successful',
          imageElement: successImage,
          messageContent: null,
        })

        await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/ticket`)

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
        // throw new Error(this.state.value.error?.title)
      }
    } catch (error: any) {
      console.log(this.state.value.message)
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        // titleContent: 'adssddsasdadsa',
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
