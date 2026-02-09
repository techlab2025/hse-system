import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'
import AddCatalogItemsDetailsUseCase from '../../Domain/useCase/addCatalogItemsDetailsUseCase'

export default class AddCatalogItemsDetailsController extends ControllerInterface<CatalogItemsModel> {
  private static instance: AddCatalogItemsDetailsController
  private constructor() {
    super()
  }
  private addCatalogItemsDetailsUseCase = new AddCatalogItemsDetailsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddCatalogItemsDetailsController()
    }
    return this.instance
  }

  async addCatalogItemsDetails(params: Params, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      const dataState: DataState<CatalogItemsModel> =
        await this.addCatalogItemsDetailsUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        if (!draft) await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog-items-details`)

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
