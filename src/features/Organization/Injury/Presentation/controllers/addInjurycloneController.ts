import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type InjuryModel from '../../Data/models/InjuryModel'
import { OpenWarningDilaog } from '@/base/Presentation/utils/OpenWarningDialog'
import AddInjuryclonesUseCase from '../../Domain/useCase/addInjurycloneUseCase'
import IndexInjuryController from './indexInjuryController'
import IndexInjuryParams from '../../Core/params/indexInjuryParams'

export default class AddInjurycloneController extends ControllerInterface<InjuryModel> {
  private static instance: AddInjurycloneController
  private constructor() {
    super()
  }
  private AddInjurycloneUseCase = new AddInjuryclonesUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddInjurycloneController()
    }
    return this.instance
  }

  async addInjuryclone(params: any, router: Router, draft: boolean = false) {
    try {
      if (params?.data?.length > 0) {
        for (const el of params.data) {
          if (!el.title) {
            new OpenWarningDilaog('title Is Required').openDialog()
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
      const dataState: DataState<InjuryModel> = await this.AddInjurycloneUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        await IndexInjuryController.getInstance().getData(new IndexInjuryParams('', 1, 10, 1))
        
        if (router.currentRoute.value.path.includes('injury')) {
          if (!draft) await router.push('/organization/injury')
        }

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
