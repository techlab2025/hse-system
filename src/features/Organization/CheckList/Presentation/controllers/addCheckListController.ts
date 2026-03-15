import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type CheckListDetailsModel from '../../Data/models/CheckListModel'
import AddCheckListUseCase from '../../Domain/useCase/addCheckListUseCase'
import IndexWhereHouseTypeController from './indexCheckListController'
import IndexWhereHouseTypeParams from '../../Core/params/indexCheckListParams'

export default class AddCheckListController extends ControllerInterface<CheckListDetailsModel> {
  private static instance: AddCheckListController
  private constructor() {
    super()
  }
  private addCheckListUseCase = new AddCheckListUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddCheckListController()
    }
    return this.instance
  }

  async addCheckList(params: any, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<CheckListDetailsModel> =
        await this.addCheckListUseCase.call(params)
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
