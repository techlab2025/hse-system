import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import AddWhereHouseTypeteUseCase from '../../Domain/useCase/addWhereHouseTypeUseCase'
import type AddWhereHouseTypeParams from '../../Core/params/addWhereHouseTypeParams'
import type WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'

export default class AddWhereHouseTypeController extends ControllerInterface<WhereHouseTypeModel> {
  private static instance: AddWhereHouseTypeController
  private constructor() {
    super()
  }
  private AddWhereHouseTypeUseCase = new AddWhereHouseTypeteUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddWhereHouseTypeController()
    }
    return this.instance
  }

  async addWhereHouseType(params: AddWhereHouseTypeParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate()?.isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<WhereHouseTypeModel> =
        await this.AddWhereHouseTypeUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        if (router.currentRoute.value.path.includes('where-house-type')) {
          if (!draft) await router.push('/organization/where-house-type')
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
