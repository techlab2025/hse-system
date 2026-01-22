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
import { Observation } from '../../Core/Enums/ObservationTypeEnum'
import CreateCapaResultUseCase from '../../Domain/useCase/CreateCapaResultUseCase'
import type CapaParams from '../../Core/params/CapaParam'
import type CapaModel from '../../Data/models/CapaModel'

export default class CreateCapaResultController extends ControllerInterface<CapaModel> {
  private static instance: CreateCapaResultController
  private constructor() {
    super()
  }
  private createCapaResultUseCase = new CreateCapaResultUseCase()

  static getInstance() {
    if (!this.instance) {
      this.instance = new CreateCapaResultController()
    }
    return this.instance
  }

  async createCapaResult(params: CapaParams, router: Router, draft: boolean = false) {
    // useLoaderStore().setLoadingWithDialog();
    try {
      // params.validate()
      // if (!params.validate().isValid) {
      //   params.validateOrThrow()
      //   return
      // }
      // console.log('Ssssssss')
      const dataState: DataState<CapaModel> = await this.createCapaResultUseCase.call(params)
      this.setState(dataState)
      if (this.isDataSuccess()) {
        DialogSelector.instance.successDialog.openDialog({
          dialogName: 'dialog',
          titleContent: 'Added was successful',
          imageElement: successImage,
          messageContent: null,
        })

        const { user } = useUserStore()

        if (params.type == Observation.HazardType) {
          await router.push(`/organization/equipment-mangement/hazard`)
        } else if (params.type == Observation.ObservationType) {
          await router.push(`/organization/equipment-mangement/observation`)
        } else if (params.type == Observation.AccidentsType) {
          await router.push(`/organization/equipment-mangement/incedant`)
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
