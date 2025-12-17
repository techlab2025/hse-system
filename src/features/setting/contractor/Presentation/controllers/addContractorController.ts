import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface.ts'
// import LangModel from '@/features/setting/languages/Data/models/langModel'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import { useRoute, type Router } from 'vue-router'
import AddContractorUseCase from '../../Domain/useCase/addContractorUseCase'
import { useUserStore } from '@/stores/user'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import type ContractorModel from '../../Data/models/ContractorModel'
import type AddContractorParams from '../../Core/params/addContractorParams'
import IndexContractorController from './indexContractorController'
import IndexContractorParams from '../../Core/params/indexContractorParams'

export default class AddContractorController extends ControllerInterface<ContractorModel> {
  private static instance: AddContractorController
  private constructor() {
    super()
  }
  private addContractorUseCase = new AddContractorUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new AddContractorController()
    }
    return this.instance
  }

  async addContractor(params: AddContractorParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<ContractorModel> = await this.addContractorUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()
        if (router.currentRoute.value.fullPath.includes('contractors')) {
          if (!draft)
            await router.push(
              `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/contractor`,
            )
        } else {
          console.log('index')
          IndexContractorController.getInstance().getData(new IndexContractorParams('', 1, 10, 1))
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
