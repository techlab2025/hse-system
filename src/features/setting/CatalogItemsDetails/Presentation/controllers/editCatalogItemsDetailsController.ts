import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
// import type CatalogModel from '../../Data/models/CatalogItemsModel'
import type CatalogItemsModel from '../../Data/models/CatalogItemsModel'
import EditCatalogItemsDetailsUseCase from '../../Domain/useCase/editCatalogItemsDetailsUseCase'

export default class EditCatalogItemsDetailsController extends ControllerInterface<CatalogItemsModel> {
  private static instance: EditCatalogItemsDetailsController

  private constructor() {
    super()
  }

  private editCatalogItemsDetailsUseCase = new EditCatalogItemsDetailsUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditCatalogItemsDetailsController()
    }
    return this.instance
  }

  async editCatalogItemsDetails(params: Params, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      const dataState: DataState<CatalogItemsModel> = await this.editCatalogItemsDetailsUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/catalog`)
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
