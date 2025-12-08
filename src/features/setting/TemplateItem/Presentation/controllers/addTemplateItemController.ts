import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import type { Router } from 'vue-router'
import type TemplateItemModel from '@/features/setting/TemplateItem/Data/models/TemplateItemModel'
import AddTemplateItemUseCase from '../../Domain/useCase/addTemplateItemUseCase'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import ShowTemplateParams from '@/features/setting/Template/Core/params/showTemplateParams'
import ShowTemplateController from '@/features/setting/Template/Presentation/controllers/showTemplateController'
import type AddTemplateItemParams from '../../Core/params/addTemplateItemParams'

export default class AddTemplateItemController extends ControllerInterface<TemplateItemModel> {
  private static instance: AddTemplateItemController
  private constructor() {
    super()
  }
  private addTemplateItemUseCase = new AddTemplateItemUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddTemplateItemController()
    }
    return this.instance
  }

  async addTemplateItem(
    params: AddTemplateItemParams,
    router: Router,
    draft: boolean = false,
    id: number,
  ) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<TemplateItemModel> = await this.addTemplateItemUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        await ShowTemplateController.getInstance().showTemplate(new ShowTemplateParams(id))
        // const { user } = useUserStore()

        // if (!draft) await router.push(`/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/template-item`)

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
