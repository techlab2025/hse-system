import { ControllerInterface } from '@/base/Presentation/Controller/controller_interface'
import type { DataState } from '@/base/core/networkStructure/Resources/dataState/data_state'
import type Params from '@/base/core/params/params'
import DialogSelector from '@/base/Presentation/Dialogs/dialog_selector'
import successImage from '@/assets/images/Success.png'
import errorImage from '@/assets/images/error.png'
import EditContractorUseCase from '../../Domain/useCase/editContractorUseCase'
import { OrganizationTypeEnum } from '@/features/auth/Core/Enum/organization_type'
import { useUserStore } from '@/stores/user'
import type ContractorModel from '../../Data/models/ContractorModel'
import type EditContractorParams from '../../Core/params/editContractorParams'
import IndexContractorController from './indexContractorController'
import IndexContractorParams from '../../Core/params/indexContractorParams'

export default class EditContractorController extends ControllerInterface<ContractorModel> {
  private static instance: EditContractorController

  private constructor() {
    super()
  }

  private editContractorUseCase = new EditContractorUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new EditContractorController()
    }
    return this.instance
  }

  async editContractor(params: EditContractorParams, router: any) {
    // useLoaderStore().setLoadingWithDialog();
    // console.log(params)
    try {
      params.validate()
      if (!params.validate().isValid) {
        params.validateOrThrow()
        return
      }
      const dataState: DataState<ContractorModel> = await this.editContractorUseCase.call(params)

      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: this.state.value.message,
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        if (router.currentRoute.value.fullPath.includes('contractor')) {
          await router.push(
            `/${user?.type == OrganizationTypeEnum.ADMIN ? 'admin' : 'organization'}/contractor`,
          )
        } else {
          console.log('index')
          IndexContractorController.getInstance().getData(new IndexContractorParams('', 1, 10, 1))
        }
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
