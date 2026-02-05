import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import router from '@/router'
import ReplaceTicketUseCase from '../../Domain/useCase/replaceTicketUseCase'
import type ReplaceTicketParams from '../../Core/params/replaceTicketParams'
import type TicketModel from '../../Data/models/TicketModel'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
const { user } = useUserStore()

export default class ReplaceTicketController extends ControllerInterface<TicketModel> {
  private static instance: ReplaceTicketController
  private constructor() {
    super()
  }
  private ReplaceTicketUseCase = new ReplaceTicketUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new ReplaceTicketController()
    }
    return this.instance
  }

  async ReplaceTicket(params: ReplaceTicketParams) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }

      const dataState: DataState<TicketModel> = await this.ReplaceTicketUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        console.log('succsess')
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'successful',
          imageElement: successImage,
          messageContent: null,
        })

        // console.log(this.state.value.data)
        // console.log(draft)
        await router.push(
          `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/ticket`,
        )

        // useLoaderStore().endLoadingWithDialog();
      } else {
        console.log('failed 1')

        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
        // throw new Error(this.state.value.error?.title)
      }
    } catch (error: any) {
      console.log('failed 2')

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
