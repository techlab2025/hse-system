import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddMeetingTypeUseCase from '../../Domain/useCase/addMeetingTypeUseCase'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddMeetingTypeExcelParams from '../../Core/params/addMeetingTypeExcelParams'
import AddMeetingTypeParams from '../../Core/params/addMeetingTypeParams'
import {
  PeriodicTypeEnum,
  validatePeriodicNumberOfDays,
} from '../../Core/Enum/periodic_type_enum'

export default class AddMeetingTypeController extends ControllerInterface<MeetingTypeModel> {
  private static instance: AddMeetingTypeController

  private constructor() {
    super()
  }

  private AddMeetingTypeUseCase = new AddMeetingTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddMeetingTypeController()
    }
    return this.instance
  }

  async addMeetingType(
    params: AddMeetingTypeParams | AddMeetingTypeExcelParams,
    router: Router,
    draft: boolean = false,
  ) {
    try {
      if (params instanceof AddMeetingTypeExcelParams) {
        if (!params.data.length) {
          new OpenWarningDilaog('At least one row is required').openDialog()
          return
        }

        for (let index = 0; index < params.data.length; index++) {
          const row = params.data[index]
          const rowNumber = index + 2

          if (!row.title?.trim() || !row.description?.trim()) {
            new OpenWarningDilaog(
              `Title and description are required in Excel row ${rowNumber}`,
            ).openDialog()
            return
          }

          if (![1, 2, 3, 4, 5].includes(Number(row.periodic_type))) {
            new OpenWarningDilaog(
              `Periodic type must be 1, 2, 3, 4 or 5 in Excel row ${rowNumber}`,
            ).openDialog()
            return
          }

          const periodError = validatePeriodicNumberOfDays(
            Number(row.periodic_type) as PeriodicTypeEnum,
            row.number_of_days,
          )
          if (periodError) {
            new OpenWarningDilaog(`${periodError} in Excel row ${rowNumber}`).openDialog()
            return
          }
        }
      } else {
        const validation = params.validate()
        if (!validation.isValid) {
          params.validateOrThrow()
          return
        }

        const periodError = validatePeriodicNumberOfDays(
          params.periodicType,
          params.numberOfDays,
        )
        if (periodError) {
          new OpenWarningDilaog(periodError).openDialog()
          return
        }
      }

      const dataState: DataState<MeetingTypeModel> = await this.AddMeetingTypeUseCase.call(params)
      this.setLoading()
      this.setState(dataState)

      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        if (router.currentRoute.value.path.includes('meeting-type')) {
          const root = router.currentRoute.value.path.startsWith('/admin')
            ? '/admin'
            : '/organization'
          if (!draft) await router.push(`${root}/meeting-types`)
        }
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'An Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: unknown) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.error?.title ?? String(error),
        imageElement: errorImage,
        messageContent: null,
      })
    }

    super.handleResponseDialogs()
    return this.state
  }
}
