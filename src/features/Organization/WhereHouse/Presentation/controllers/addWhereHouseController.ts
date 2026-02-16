import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddWhereHouseteUseCase from '../../Domain/useCase/addWhereHouseUseCase'
import type AddWhereHouseParams from '../../Core/params/addWhereHouseParams'
import type WhereHouseModel from '../../Data/models/WhereHouseModel'

export default class AddWhereHouseController extends ControllerInterface<WhereHouseModel> {
  private static instance: AddWhereHouseController
  private constructor() {
    super()
  }
  private AddWhereHouseUseCase = new AddWhereHouseteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddWhereHouseController()
    }
    return this.instance
  }

  async addWhereHouse(params: AddWhereHouseParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate()?.isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<WhereHouseModel> = await this.AddWhereHouseUseCase.call(params)
      this.setState(dataState)
      this.setLoading()
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('where-house')) {
          if (!draft) await router.push('/organization/where-house')
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
