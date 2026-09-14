import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import type MeetingTypeModel from '../../Data/models/MeetingTypeModel'
import AddMeetingTypeUseCase from '../../Domain/useCase/addMeetingTypeUseCase'
import AddMeetingTypeExcelParams from '../../Core/params/addMeetingTypeExcelParams'
import type AddMeetingTypeParams from '../../Core/params/addMeetingTypeParams'

export default class AddMeetingTypeController extends ControllerInterface<MeetingTypeModel> {
  private static instance: AddMeetingTypeController
  private constructor() {
    super()
  }
  private addMeetingTypeUseCase = new AddMeetingTypeUseCase()

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
    // useLoaderStore().setLoadingWithDialog();
    try {
      if (params instanceof AddMeetingTypeExcelParams) {
        if (!params.data.length) {
          new OpenWarningDilaog('At least one row is required').openDialog()
          return
        }
        for (const el of params.data) {
          if (!el.title) {
            new OpenWarningDilaog('Title is required').openDialog()
            return
          }
        }
      } else {
        params.validate()
        if (!params.validate().isValid) {
          params.validateOrThrow()
          return
        }
      }
      const dataState: DataState<MeetingTypeModel> = await this.addMeetingTypeUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('ppe-item')) {
          const root = router.currentRoute.value.path.startsWith('/admin')
            ? '/admin'
            : '/organization'
          if (!draft) await router.push(`${root}/ppe-items`)
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
