import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type IncidentCategoryModel from '../../Data/models/IncidentCategoryModel'
import EditIncidentCategoryUseCase from '../../Domain/useCase/editIncidentCategoryUseCase'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import type EditIncidentCategoryParams from '../../Core/params/editIncidentCategoryParams'

export default class EditIncidentCategoryController extends ControllerInterface<IncidentCategoryModel> {
  private static instance: EditIncidentCategoryController

  private constructor() {
    super()
  }

  private editIncidentCategoryUseCase = new EditIncidentCategoryUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditIncidentCategoryController()
    }
    return this.instance
  }

  async editIncidentCategory(params: EditIncidentCategoryParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      params.validate()

      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<IncidentCategoryModel> =
        await this.editIncidentCategoryUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog-success',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        await router.push(
          `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/incident-category`,
        )
        // console.log(this.state.value.data)
      } else {
        DialogSelector.instance.failedDialog.openDialog({
          dialogName: 'dialog-error',
          titleContent: this.state.value.error?.title ?? 'Ann Error Occurred',
          imageElement: errorImage,
          messageContent: null,
        })
      }
    } catch (error: any) {
      DialogSelector.instance.failedDialog.openDialog({
        dialogName: 'dialog-error',
        titleContent: this.state.value.message,
        imageElement: errorImage,
        messageContent: null,
      })
    }
    return this.state
  }
}
