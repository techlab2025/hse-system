import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type WhereHouseTypeModel from '../../Data/models/WhereHouseTypeModel'
import AddWhereHouseTypeCloneUseCase from '../../Domain/useCase/addWhereHouseTypeCloneUseCase'
import IndexWhereHouseTypeController from './indexWhereHouseTypeController'
import IndexWhereHouseTypeParams from '../../Core/params/indexWhereHouseTypeParams'

export default class AddWhereHouseTypeCloneController extends ControllerInterface<WhereHouseTypeModel> {
  private static instance: AddWhereHouseTypeCloneController
  private constructor() {
    super()
  }
  private addWhereHouseTypeCloneUseCase = new AddWhereHouseTypeCloneUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddWhereHouseTypeCloneController()
    }
    return this.instance
  }

  async addWhereHouseTypeClone(params: any, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<WhereHouseTypeModel> =
        await this.addWhereHouseTypeCloneUseCase.call(params)
      this.setLoading()
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })
        // if (router.currentRoute.value.path.includes('where-house-type')) {
        //   if (!draft) await router.push('/organization/where-house-type')
        // }

        // useLoaderStore().endLoadingWithDialog();
        await IndexWhereHouseTypeController.getInstance().getData(
          new IndexWhereHouseTypeParams('', 1, 10, 1),
        )
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
