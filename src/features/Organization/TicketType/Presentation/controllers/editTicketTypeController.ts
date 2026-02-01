import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type EditTicketTypeParams from '../../Core/params/editTicketTypeParams'
import type TicketTypeModel from '../../Data/models/TicketTypeModel'
import EditTicketTypeUseCase from '../../Domain/useCase/editTicketTypeUseCase'

export default class EditTicketTypeController extends ControllerInterface<TicketTypeModel> {
  private static instance: EditTicketTypeController

  private constructor() {
    super()
  }

  private EditTicketTypeUseCase = new EditTicketTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditTicketTypeController()
    }
    return this.instance
  }

  async editTicketType(params: EditTicketTypeParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<TicketTypeModel> = await this.EditTicketTypeUseCase.call(params)

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
          `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/root-causes`,
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
