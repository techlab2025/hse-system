import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddDrillTypeUseCase from '../../Domain/useCase/addDrillTypeUseCase'
import type DrillTypeModel from '../../Data/models/DrillTypeModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddDrillTypeExcelParams from '../../Core/params/addDrillTypeExcelParams'
import AddDrillTypeParams from '../../Core/params/addDrillTypeParams'

export default class AddDrillTypeController extends ControllerInterface<DrillTypeModel> {
  private static instance: AddDrillTypeController
  private constructor() {
    super()
  }
  private AddDrillTypeUseCase = new AddDrillTypeUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddDrillTypeController()
    }
    return this.instance
  }

  async addDrillType(
    params: AddDrillTypeParams | AddDrillTypeExcelParams,
    router: Router,
    draft: boolean = false,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      if (params instanceof AddDrillTypeExcelParams) {
        if (!params.data.length) {
          new OpenWarningDilaog('At least one row is required').openDialog()
          return
        }
        for (const el of params.data) {
          if (!el.title || !el.description) {
            new OpenWarningDilaog('Title and description are required').openDialog()
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
      const dataState: DataState<DrillTypeModel> =
        await this.AddDrillTypeUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('drill-type')) {
          const root = router.currentRoute.value.path.startsWith('/admin') ? '/admin' : '/organization'
          if (!draft) await router.push(`${root}/drill-types`)
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
