import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import AddEquipmentTypeUseCase from '@/features/setting/EquipmentType/Domain/useCase/addEquipmentTypeUseCase'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type RootCausesModel from '@/features/setting/RootCauses/Data/models/RootCausesModel'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import type AddTicketTypeParams from '../../Core/params/addTicketTypeParams'
import AddTicketTypeUseCase from '../../Domain/useCase/addTicketTypeUseCase'
import type TicketTypeModel from '../../Data/models/TicketTypeModel'

export default class AddTicketTypeController extends ControllerInterface<TicketTypeModel> {
  private static instance: AddTicketTypeController
  private constructor() {
    super()
  }
  private AddTicketTypeUseCase = new AddTicketTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTicketTypeController()
    }
    return this.instance
  }

  async addTicketType(params: AddTicketTypeParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<TicketTypeModel> = await this.AddTicketTypeUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        if (!draft)
          await router.push(
            `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/ticket-type`,
          )

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
