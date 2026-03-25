import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type EquipmentModel from '@/features/setting/Equipment/Data/models/equipmentModel'
import AddEquipmentUseCase from '../../Domain/useCase/addEquipmentUseCase'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type AddEquipmentParams from '../../Core/params/addEquipmentParams'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import { EquipmentStatus } from '../../Core/enum/equipmentStatus'

export default class AddEquipmentController extends ControllerInterface<EquipmentModel> {
  private static instance: AddEquipmentController
  private constructor() {
    super()
  }
  private addEquipmentUseCase = new AddEquipmentUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddEquipmentController()
    }
    return this.instance
  }

  async addEquipment(params: AddEquipmentParams | any, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    if (Array.isArray(params.data)) {
      if (params.data.length === 0) {
        new OpenWarningDilaog('Excel file contains no data').openDialog()
        // console.log('emptyyyy')
        return
      }

      for (const el of params.data) {
        if (!el.name) {
          new OpenWarningDilaog('Name Is Required').openDialog()
          return
        }

        if (!el.equipment_type_id) {
          new OpenWarningDilaog('Equipment Type Is Required').openDialog()
          return
        }

        if (!el.status) {
          new OpenWarningDilaog('Status Is Required').openDialog()
          return
        }

        if (el.status == EquipmentStatus.RENT && !el.period_type) {
          new OpenWarningDilaog('Rent Type Is Required').openDialog()
          return
        }

        if (el.status == EquipmentStatus.RENT && !el.period) {
          new OpenWarningDilaog('Rent Period Is Required').openDialog()
          return
        }

        if (el.status == EquipmentStatus.RENT && !el.checkin_date) {
          new OpenWarningDilaog('Rent Start Date Is Required').openDialog()
          return
        }

        if (el.status == EquipmentStatus.RENT && !el.checkout_date) {
          new OpenWarningDilaog('Rent End Date Is Required').openDialog()
          return
        }
      }
    } else {
      if (params?.status == EquipmentStatus.RENT && Number(params?.equipmentRentTime) < 1) {
        new OpenWarningDilaog('Rent Time Should Be More Than One').openDialog()
        return
      }
      if (params?.status == EquipmentStatus.RENT && !params?.equipmentRentStartDate) {
        new OpenWarningDilaog('Rent Start Date Is Required').openDialog()
        return
      }
    }
    try {
      const dataState: DataState<EquipmentModel> = await this.addEquipmentUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()
        if (
          router.currentRoute.value.path.includes('equipment/add') ||
          router.currentRoute.value.path.includes('equipment/upload-excel')
        ) {
          if (!draft)
            await router.push(
              `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/equipments`,
            )
        }

        // useLoaderStore().endLoadingWithDialog();
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? (error as string),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
